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
        origin: "http://localhost:3000",
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



  //   });
  // },
  // bootstrap() {
  //   const io = new Server(strapi.server.httpServer, {
  //     cors: {
  //       origin: "http://localhost:3000",
  //       methods: ["GET", "POST"],
  //       allowedHeaders: ["my-custom-header"],
  //       credentials: true,
  //     },
  //   });

  //   io.on("connection", (socket) => {
  //     console.log("New user connected");

  //     socket.on("joinSession", async ({ sessionId }) => {
  //       socket.join(sessionId);
  //       console.log(`User joined session: ${sessionId}`);

  //       try {
  //         // Fetch previous messages for the session from Strapi
  //         const response = await axios.get(
  //           `http://localhost:1337/api/messages?filters[session][$eq]=${sessionId}&sort=createdAt:asc`
  //         );

  //         const previousMessages = response.data.data.map((msg) => ({
  //           id: msg.id,
  //           session: msg.attributes.session,
  //           content: msg.attributes.content,
  //           role: msg.attributes.role,
  //         }));

  //         // Send previous messages to the user who joined
  //         socket.emit("previousMessages", previousMessages);
  //       } catch (error) {
  //         console.error("Error fetching previous messages:", error.message);
  //       }
  //     });

  //     socket.on("sendMessage", async (data) => {
  //       console.log("Received message:", data);

  //       try {
  //         const userMessage = {
  //           data: {
  //             session: data.session,
  //             content: data.content,
  //             role: "user",
  //           },
  //         };

  //         // Save user's message in the database
  //         const savedUserMessage = await axios.post(
  //           "http://localhost:1337/api/messages",
  //           userMessage
  //         );

  //         // Broadcast the user's message to the chat room
  //         io.to(data.session).emit("receiveMessage", savedUserMessage.data.data);

  //         // Simulating assistant response (replace with AI logic if needed)
  //         const assistantResponse = `I received: "${data.content}"`; // Example: Replace with actual AI processing

  //         const assistantMessage = {
  //           data: {
  //             session: data.session,
  //             content: assistantResponse,
  //             role: "assistant",
  //           },
  //         };

  //         // Save assistant's response in the database
  //         const savedAssistantMessage = await axios.post(
  //           "http://localhost:1337/api/messages",
  //           assistantMessage
  //         );

  //         // Send assistant's message back to the user
  //         io.to(data.session).emit("receiveMessage", savedAssistantMessage.data.data);
  //       } catch (error) {
  //         console.error("Error processing message:", error.message);
  //       }
  //     });

  //     socket.on("disconnect", () => {
  //       console.log("User disconnected");
  //     });
  //   });
}