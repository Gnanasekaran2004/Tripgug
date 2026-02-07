package com.tripguy.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.annotation.web.socket.AbstractSecurityWebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketSecurityConfig extends AbstractSecurityWebSocketMessageBrokerConfigurer {

    @Override
    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                .nullDestMatcher().permitAll() // Allow CONNECT
                .simpSubscribeDestMatchers("/topic/**").permitAll() // Allow Subscribe
                .simpDestMatchers("/app/**").permitAll() // Allow Sending
                .anyMessage().permitAll(); // Allow everything else
    }

    @Override
    protected boolean sameOriginDisabled() {
        return true; // Disable SameOrigin requirement
    }
}
