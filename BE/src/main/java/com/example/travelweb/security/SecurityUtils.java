package com.example.travelweb.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.Jwt;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Long getTokenUserId(Jwt jwt) {
        if (jwt == null) {
            throw new AccessDeniedException("Missing authenticated principal");
        }

        Object userId = jwt.getClaim("userId");
        if (userId instanceof Number number) {
            return number.longValue();
        }
        if (userId instanceof String value && !value.isBlank()) {
            try {
                return Long.parseLong(value);
            } catch (NumberFormatException ex) {
                throw new AccessDeniedException("Invalid user id claim");
            }
        }

        throw new AccessDeniedException("Missing user id claim");
    }

    public static void requireTokenUserId(Long requestedUserId, Jwt jwt) {
        if (requestedUserId == null) {
            throw new IllegalArgumentException("User id is required");
        }

        Long tokenUserId = getTokenUserId(jwt);
        if (!tokenUserId.equals(requestedUserId)) {
            throw new AccessDeniedException("Requested user id does not match authenticated user");
        }
    }
}
