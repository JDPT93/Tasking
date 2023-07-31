package brainary.tasking.tokens;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import io.jsonwebtoken.Claims;

public class JwtToken extends UsernamePasswordAuthenticationToken {

    public JwtToken(Claims claims) {
        super(claims, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
    }

    public String getId() {
        return ((Claims) this.getPrincipal()).getId();
    }

    public String getSubject() {
        return ((Claims) this.getPrincipal()).getSubject();
    }

    public Claims getClaims() {
        return (Claims) this.getPrincipal();
    }

}