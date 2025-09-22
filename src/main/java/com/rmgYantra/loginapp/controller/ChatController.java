package com.rmgYantra.loginapp.controller;

import com.rmgYantra.loginapp.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashSet;
import java.util.Set;

@Controller
public class ChatController {

    private Set<String> users = new HashSet<>();

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        if ("JOIN".equals(message.getStatus())) {
            users.add(message.getSenderName());
//            broadcastUsers();
        }
        return message;
    }

    @MessageMapping("/private-message")
    public void recMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
    }

    @MessageMapping("/disconnect")
    public void disconnect(@Payload Message message) {
        if (users.remove(message.getSenderName())) {

        }
    }
}
//    private void broadcastUsers() {
//        simpMessagingTemplate.convertAndSend("/chatroom/users", users);
//    }

