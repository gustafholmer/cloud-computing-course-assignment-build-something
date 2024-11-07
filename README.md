# Chatbot Microservices Application

This project is a simple chatbot application designed with a microservices architecture, deployed using Kubernetes.

## Overview

The application includes:
- **Frontend Service**: A web-based UI for interacting with the chatbot.
- **Backend Service**: A Node.js API to handle chat messages.
- **Database**: A PostgreSQL instance storing users and conversation history.

## Quick Start

1. **Deploy to Kubernetes**:
     ```bash
     kubectl apply -f kubernetes-deployment.yaml
     ```

2. **Access the App**:
   - **Frontend**: http://localhost:30080
   - **Backend**: http://localhost:30081

## API Endpoints

- **POST /api/startChat** - Start a conversation.
- **POST /api/sendMessage** - Send a chat message.
- **GET /api/conversationHistory/:username** - Retrieve conversation history.

