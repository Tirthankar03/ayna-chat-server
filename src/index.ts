// import type { Core } from '@strapi/strapi';
import { Server } from "socket.io"; // Use CommonJS syntax
import axios from "axios";
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: ["http://localhost:3000", "https://ayna-chat-tn.vercel.app"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });


    io.on("connection", function (socket) {

    console.log("New user connected");

    socket.on("joinSession", ({ sessionId }) => {
      socket.join(sessionId); // Join a specific chat room
      console.log(`User joined session: ${sessionId}`);
    });
  
    socket.on("sendMessage", async (data) => {
      console.log("Received message:", data);
  

      try {
            const strapiData = {
              data: {
                session: data.session,
                content: data.content,
                role: data.role,
              }
            };

            console.log('data.session>>>>', data.session)

    
              //save the message sent by the user to the db
              await axios.post("http://localhost:1337/api/messages", strapiData);

              // io.to(data.session).emit("receiveMessage",savedUserMessage.data.data);

              const assistantData = {
                data: {
                  session: data.session,
                  content: data.content,
                  role: "assistant",
                }
              };
              //save the same message to the db but with the role as assistant
              const savedAssistantMessage = await axios.post("http://localhost:1337/api/messages",assistantData);
              
              console.log('data.session>>>>', data.session)
              //we immediately broadcast back the same message to the user (on a socket that user is listening to)
              io.to(data.session).emit("receiveMessage", savedAssistantMessage.data.data);
            } catch (e) {
              console.log("error", e.message);
            }
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    })
  })
}
}