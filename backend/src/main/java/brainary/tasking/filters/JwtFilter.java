package brainary.tasking.filters;

import java.io.IOException;
import java.sql.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";

    private static final String PREFIX = "Bearer ";

    @Value(value = "${tasking.jwt.signing-key}")
    private String signingKey;

    @Value(value = "${tasking.jwt.expiration-time}")
    private Long expirationTime;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        try {
            String authorization = request.getHeader(HEADER);
            if (Objects.isNull(authorization) || !authorization.startsWith(PREFIX)) {
                SecurityContextHolder.clearContext();
            } else {
                Claims claims = Jwts.parser().setSigningKey(signingKey.getBytes()).parseClaimsJws(authorization.substring(PREFIX.length())).getBody();
                if (Objects.isNull(claims.get("authorities"))) {
                    SecurityContextHolder.clearContext();
                } else {
                    SecurityContextHolder.getContext()
                        .setAuthentication(
                            new UsernamePasswordAuthenticationToken(
                                claims.getSubject(),
                                null,
                                Stream.of(claims.get("authorities"))
                                    .map(authority -> new SimpleGrantedAuthority(authority.toString()))
                                    .toList()));
                }
            }
            chain.doFilter(request, response);
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException exception) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, exception.getMessage());
        }
    }

    public String authorize(String subject, List<String> authorities) {
        Long currentTime = System.currentTimeMillis();
        return Jwts.builder()
            .setId(currentTime.toString().concat(":").concat(subject))
            .setSubject(subject)
            .claim("authorities", authorities)
            .setIssuedAt(new Date(currentTime))
            .setExpiration(new Date(currentTime + expirationTime))
            .signWith(SignatureAlgorithm.HS256, signingKey.getBytes())
            .compact();
    }

}