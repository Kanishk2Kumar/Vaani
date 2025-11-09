# 🗣️ Vaani – Voice-First Conversational AI for Finance

**Vaani** is an intelligent, voice-first conversational assistant built for seamless and empathetic user interactions in financial domains like **peer-to-peer lending**. It is optimized for accessibility, efficiency, and plug-and-play integration, particularly for platforms like **LenDenClub**.

🚀 This project showcases how voice-first conversational AI can bridge the gap for users with limited digital literacy, especially in financial services. By combining empathetic communication, real-time analytics, and seamless integration, Vaani empowers both users and businesses with accessible, intelligent, and scalable support solutions.

![Screenshot 2025-06-10 010623](https://github.com/user-attachments/assets/08a22eeb-7234-40db-a703-76abf85993b5)

## 📌 Project Overview

- **Project Title**: Vaani  
- **Domain**: Conversational AI / Finance  
- **Use Case**: Creating Conversational Intelligence  
- **Team Name**: Team Optimus  
- **Demo Video**: [YouTube Presentation](https://www.youtube.com/watch?v=pykrJGBJsqM)


## ❗ Problem Understanding & Scope

The challenge is to create **voice-first interactions** that feel natural, informative, and customizable for a financial services platform. The system should:

- Assist users with limited digital literacy  
- Help first-time borrowers understand loan offerings  
- Reduce support workload with fast, AI-driven assistance  
- Be easily adaptable across use cases (support, sales, etc.)

### 👥 Target Users

- Individuals in Tier 2 & Tier 3 cities  
- First-time loan seekers  
- Repeat users needing quick, human-free support  


## 🧩 Key Features

- 🧠 **Intelligent Voice Response (IVR)**: Multilevel, customizable IVR for call routing  
- 📊 **Real-Time Analytics**: Dashboards for insights on interaction trends  
- 🔌 **Plug-and-Play Mechanism**: Simple API integration for business teams  
- 🔁 **Customizable Workflows**: Business teams can modify assistant flows  
- 🗣️ **Empathetic Communication**: Emotion-aware voice interactions  
- 🔄 **Interrupt Handling**: Recognizes "stop", "hold on", etc., mid-conversation


## 🗂️ Use Cases

- 📞 Automated Customer Support  
- 📅 Appointment Scheduling  
- 📣 Sales & Promotions  
- 🔗 CRM System Integration  

## Technical Architecture:

![Vaani_TechincalArchitecture](https://github.com/user-attachments/assets/e08c9b8d-dfb7-4111-a0a0-b8f2849033ac)


## 🧠 Conversation Design (Layered Pipeline)

![Vaani](https://github.com/user-attachments/assets/69ba2398-802b-42a5-87d4-05ee2246b09a)


### 🧾 Transcription Layer
- **Background Voice Filtering**: Ignores ambient noise or background chatter

### 🧭 Orchestration Layer
- **End Point Detection**: Detects when the user finishes speaking  
- **Interruption Model**: Supports commands like “stop”, “wait”, etc.

### 💬 Output Layer
- **LLM with RAG**: Retrieves answers using file uploads and vector search  
- **User Context**: Personalized responses based on query history

## CI/CD Pipeline & Deployment Summary
![ProjectStructure](https://github.com/user-attachments/assets/d2576178-b995-4528-a857-abb0b13627cb)


Backend Repo LINK: https://github.com/Kanishk2Kumar/Vaani-Backend
