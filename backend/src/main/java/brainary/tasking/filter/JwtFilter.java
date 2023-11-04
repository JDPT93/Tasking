package brainary.tasking.filter;

import java.io.IOException;
import java.sql.Date;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import brainary.tasking.token.JwtToken;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component(value = "filter.jwt")
public class JwtFilter extends OncePerRequestFilter {

    private static final String PREFIX = "Bearer ";

    @Value(value = "${tasking.jwt.signing-key}")
    private String signingKey;

    @Value(value = "${tasking.jwt.expiration-time}")
    private Long expirationTime;

    public String authorize(String subject) {
        Long currentTime = System.currentTimeMillis();
        return Jwts.builder()
            .setId(subject.concat("@").concat(currentTime.toString()))
            .setSubject(subject)
            .setIssuedAt(new Date(currentTime))
            .setExpiration(new Date(currentTime + expirationTime))
            .signWith(SignatureAlgorithm.HS256, signingKey.getBytes())
            .compact();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        try {
            String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (!Objects.isNull(authorization) && authorization.startsWith(PREFIX)) {
                SecurityContextHolder.getContext().setAuthentication(new JwtToken(Jwts.parser().setSigningKey(signingKey.getBytes()).parseClaimsJws(authorization.substring(PREFIX.length())).getBody()));
            } else {
                SecurityContextHolder.clearContext();
            }
            chain.doFilter(request, response);
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException exception) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, exception.getMessage());
        }
    }

}