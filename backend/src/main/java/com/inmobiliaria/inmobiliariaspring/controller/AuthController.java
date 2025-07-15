package com.inmobiliaria.inmobiliariaspring.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inmobiliaria.inmobiliariaspring.dto.AuthRequest;
import com.inmobiliaria.inmobiliariaspring.util.JwtUtil;
import com.inmobiliaria.inmobiliariaspring.model.Administrador;
import com.inmobiliaria.inmobiliariaspring.model.Cliente;
import com.inmobiliaria.inmobiliariaspring.repository.AdministradorRepository;
import com.inmobiliaria.inmobiliariaspring.repository.ClienteRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
@RestController
public class AuthController {


    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/authenticate")
    @Operation(summary = "Autenticar usuario", description = "Genera un token JWT para el usuario autenticado.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Autenticación exitosa"),
        @ApiResponse(responseCode = "401", description = "Credenciales inválidas"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    public ResponseEntity<?> createAuthenticationToken(
            @RequestBody AuthRequest authRequest,
            //@RequestParam String usernameOrEmail,
            //@RequestParam String password,
            @RequestParam(required = false, defaultValue = "false") boolean rememberMe,
            HttpServletResponse resp) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.usernameOrEmail, authRequest.password)
            );

            final UserDetails userDetails = userDetailsService
                    .loadUserByUsername(authRequest.usernameOrEmail);

            String rol = userDetails.getAuthorities().iterator().next().getAuthority();
            final String jwt = jwtUtil.generateToken(
                    userDetails.getUsername(),
                    rol
            );

            // NUEVO: Obtener el id según el rol
            Long id = null;
            if (rol.equals("ROLE_ADMIN") || rol.equals("ROLE_MASTER")) {
                // Busca el admin por username
                Optional<Administrador> adminOpt = administradorRepository.findByUsername(authRequest.usernameOrEmail);
                if (adminOpt.isPresent()) {
                    id = adminOpt.get().getIdAdmin() != null ? adminOpt.get().getIdAdmin().longValue() : null;
                }
            } else if (rol.equals("ROLE_CLIENTE")) {
                // Busca el cliente por email
                Optional<Cliente> clienteOpt = clienteRepository.findByEmail(authRequest.usernameOrEmail);
                if (clienteOpt.isPresent()) {
                    id = clienteOpt.get().getIdCliente() != null ? clienteOpt.get().getIdCliente().longValue() : null;
                }
            }

            // Configurar la cookie si rememberMe es true (se usa jwt)
            if(rememberMe){
                Cookie cookie = new Cookie("jwt", jwt);
                cookie.setHttpOnly(true);
                // El setPath asegura que la cookie esté disponible en todas las rutas de la aplicación
                cookie.setPath("/");
                cookie.setMaxAge(60 * 60 * 24 * 7); // 1 semana
                //cookie.setSecure(true); // Asegura que la cookie solo se envíe a través de HTTPS
                resp.addCookie(cookie);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("rol", rol);
            response.put("id", id); // <-- Agrega el id aquí

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales inválidas");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error de autenticación: " + e.getMessage());
        }
    }
}
