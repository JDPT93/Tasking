package brainary.tasking.security;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import io.jsonwebtoken.Claims;

public class JwtToken extends UsernamePasswordAuthenticationToken {

	public JwtToken(Claims claims) {
		super(claims, null, List.of(new SimpleGrantedAuthority("ROLE_USER")));
	}

	public String getId() {
		return ((Claims) getPrincipal()).getId();
	}

	public String getSubject() {
		return ((Claims) getPrincipal()).getSubject();
	}

	public Claims getClaims() {
		return (Claims) getPrincipal();
	}

}