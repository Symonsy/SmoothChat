import React, { useState, useEffect, useMemo, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { auth, sendMessage, listenForMessages } from "../firebase/firebase";

import logo from "../../public/assets/logo.png";
import defaultAvatar from "../../public/assets/default.jpg";
import { formatTimestamp } from "../utils/formatTimestamp";

const ChatBox = ({ selectedUser }) => {
    // State to store the current message input by the user
    const [messageText, setMessageText] = useState("");

    // State to store the list of messages in the chat
    const [messages, setMessages] = useState([]);

    // Generate a unique chat ID based on the user IDs of both participants
    // Ensures the smaller user ID comes first to maintain consistency
    const chatId = auth.currentUser?.uid < selectedUser?.uid ? `${auth.currentUser?.uid}-${selectedUser?.uid}` : `${selectedUser?.uid}-${auth.currentUser?.uid}`;

    // Store the current user (logged-in user)
    const user1 = auth.currentUser;

    // Store the selected user (the person the current user is chatting with)
    const user2 = selectedUser;

    // Get the email of the sender (current user)
    const senderEmail = auth.currentUser.email;

    // Create a reference to the chat container for scrolling purposes
    const scrollRef = useRef(null);

    // UseEffect to listen for messages in real-time whenever the chatId changes
    useEffect(() => {
        listenForMessages(chatId, setMessages); // Calls Firebase function to listen for new messages in this chat
    }, [chatId]); // Runs again if chatId changes (i.e., when switching chats)

    // UseEffect to automatically scroll to the latest message when messages update
    useEffect(() => {
        if (scrollRef.current) {
            // Moves the scrollbar to the bottom of the chat container
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]); // Runs every time messages update

    // Sort messages based on their timestamp to ensure they are displayed in order
    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => a.timestamp - b.timestamp);
    }, [messages]); // Runs whenever messages change

    // Log messages to the console (for debugging)
    console.log(messages);

    // Function to send a message when the user submits the form
    const handleSendMessage = (e) => {
        e.preventDefault(); // Prevents the page from refreshing when the form is submitted

        if (messageText.trim()) {
            // Ensures the message is not empty before sending
            const newMessage = {
                sender: senderEmail, // Stores the sender's email
                text: messageText, // Stores the message content
                timestamp: {
                    seconds: Math.floor(Date.now() / 1000), // Current time in seconds
                    nanoseconds: 0, // Default nanoseconds (not used here)
                },
            };

            // Temporarily add the message to the local state before it gets stored in Firebase
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            // Call Firebase function to store the message in the database
            sendMessage(messageText, chatId, user1?.uid, user2?.uid);

            // Clear the input field after sending the message
            setMessageText("");
        }
    };

    return (
        <>
            {selectedUser ? (
                <section className="flex flex-col items-start justify-start h-screen w-[100%] bg-[#e5f6f3]">
                    <header className="border-b border-red w-[100%] h-[70px] md:h-fit p-4 bg-[#ffffff]">
                        <main className="flex items-center gap-3">
                            <span className="relative">
                                <img className="h-11 w-11 object-cover rounded-full" src={selectedUser?.image || defaultAvatar} alt="User" />
                            </span>
                            <span>
                                <h3 className="font-semibold text-[#2A3D39] text-lg">{selectedUser?.fullName}</h3>
                                <p className="font-light text-[#2A3D39] text-sm">@{selectedUser?.username}</p>
                            </span>
                        </main>
                    </header>

                    <main className="custom-scrollbar background-image relative h-[100vh] w-[100%] flex flex-col justify-between">
                        {/* The main container for the chat screen
                        - Takes the full height of the viewport (100vh)
                        - Uses flexbox to arrange items in a column
                        - `justify-between` ensures messages are at the top, and input is at the bottom
                        - Has a custom scrollbar and a background image */}

                        <section className="px-3 pt-5 pb-20 lg:pb-10">
                            {/* A section wrapping the messages 
                                - Adds padding to prevent overlap with the input field at the bottom */}

                            <div ref={scrollRef} className="overflow-auto h-[80vh] custom-scrollbar">
                                {/* The message container:
                                - `ref={scrollRef}` allows auto-scrolling to the latest message
                                - `overflow-auto` makes it scrollable
                                - `h-[80vh]` ensures it takes 80% of the screen height */}

                                {sortedMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.sender === senderEmail
                                                ? "flex-col items-end w-full" // Aligns messages from the current user to the right
                                                : "flex-col items-start w-full"
                                        } // Aligns messages from the other user to the left
                        gap-5 mb-7`} // Adds space between messages
                                    >
                                        {msg.sender === senderEmail ? ( // Checks if the message was sent by the current user
                                            <span className="flex gap-3 me-10">
                                                {/* Wraps the sent message */}
                                                <div className="h-auto">
                                                    {/* Message bubble for the sender */}
                                                    <div className="flex items-center justify-center rounded-lg bg-[#fff] p-6 shadow-sm">
                                                        {/* Styles the message:
                                        - Rounded corners
                                        - White background
                                        - Adds padding and shadow */}
                                                        <h4 className="font-medium text-[17px] text-gray-800 w-full break-words">
                                                            {msg.text} {/* Displays the message text */}
                                                        </h4>
                                                    </div>
                                                    <p className="text-[#2A3D396E] text-xs text-right">
                                                        {formatTimestamp(msg?.timestamp)} {/* Formats and shows the timestamp */}
                                                    </p>
                                                </div>
                                            </span>
                                        ) : (
                                            // If the message was received (not sent by the current user)
                                            <span className="flex gap-3 w-[40%] h-auto ms-10">
                                                {/* Wraps the received message */}
                                                <img className="h-11 w-11 object-cover rounded-full" src={selectedUser?.image || defaultAvatar} alt="User" />
                                                {/* Displays the sender's profile picture or a default avatar */}
                                                <div>
                                                    <div className="flex items-center justify-center rounded-lg bg-[#fff] p-6 w-full shadow-sm">
                                                        {/* Message bubble for the received message */}
                                                        <h4 className="font-medium text-[17px] text-gray-800 w-full break-words">
                                                            {msg.text} {/* Displays the message text */}
                                                        </h4>
                                                    </div>
                                                    <p className="text-[#2A3D396E] text-xs">
                                                        {formatTimestamp(msg?.timestamp)} {/* Formats and shows the timestamp */}
                                                    </p>
                                                </div>
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Sticky message input box at the bottom */}
                        <div className="sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%] ">
                            <form onSubmit={handleSendMessage} className="flex items-center bg-white h-[45px] w-[100%] px-2 rounded-lg relative shadow-lg">
                                {/* The input field where users type messages */}
                                <input
                                    value={messageText} // Binds input value to state
                                    onChange={(e) => setMessageText(e.target.value)} // Updates state on change
                                    className="h-full text-[#2A3D39] outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-[100%]"
                                    type="text"
                                    placeholder="Digite sua messagem..."
                                />

                                {/* Send button */}
                                <button type="submit" className="flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#D9F2ED] hover:bg-[#C8EAE3]" aria-label="Send message">
                                    <RiSendPlaneFill color="#01AA85" className="w-[18px] h-[18px]" />
                                    {/* Send icon */}
                                </button>
                            </form>
                        </div>
                    </main>
                </section>
            ) : (
                <section className="h-screen w-[100%] bg-[#e5f6f3]">
                    <div className="flex flex-col justify-center items-center h-[100vh]">
                        <img src={logo} width={100} alt="" />
                        <h1 className="text-[30px] font-bold text-teal-700 mt-5">Bem vindo ao SmoothChat</h1>
                        <p className="text-gray-500">Conecte-se e converse com seus amigos rapidamente.</p>
                    </div>
                </section>
            )}
        </>
    );
};

export default ChatBox;
// import React, { useEffect, useMemo, useState, useRef } from "react";
// import { RiSendPlaneFill } from "react-icons/ri";
// import { messageData } from "../data/messageData.js";
// import { auth, sendMessage } from "../firebase/firebase.js";
// // import { auth, sendMessage, listenForMessages } from "../firebase/firebase.js";
// // import logo from "../../public/assets/logo.png";
// import defaultAvatar from "../../public/assets/default.jpg";
// import { formatTimestamp } from "../utils/formatTimestamp.js";

// const ChatBox = ({ selectedUser }) => {
//   const [messageText, setMessageText] = useState("");
//   const [messages, setMessages] = useState([]);
//   const scrollRef = useRef(null);

//   const chatId =
//     auth.currentUser?.uid < selectedUser?.uid
//       ? `${auth.currentUser?.uid}-${selectedUser?.uid}`
//       : `${selectedUser?.uid}-${auth.currentUser?.uid}`;

//   const user1 = auth?.currentUser;
//   const user2 = selectedUser;
//   const senderEmail = auth?.currentUser?.email;
//   // const scrollRef = useRef(null);

//   // aparentemente as três linhas de código abaixo não são necessárias no código final
//   console.log(typeof chatId);
//   console.log(user1);
//   console.log(user2);

//   useEffect(() => {
//     setMessages(messageData);
//   }, []);
//   // useEffect(() => {
//   //  listenForMessages(chatId, setMessages);
//   // }, [chatId]);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sortedMessages = useMemo(() => {
//     return [...messages].sort((a, b) => {
//       const aTimestamp = a.timestamp.seconds + a.timestamp.nanoseconds / 1e9;
//       const bTimestamp = b.timestamp.seconds + b.timestamp.nanoseconds / 1e9;
//       return aTimestamp - bTimestamp;
//     });
//   }, [messages]);
//   //const sortedMessages = useMemo(() => {
//   // return [...messages].sort((a, b) => a.timestamp - b.timestamp);
//   // }, [messages]);
//   // console.log(messages);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     const newMessage = {
//       sender: senderEmail,
//       text: messageText,
//       timestamp: {
//         seconds: Math.floor(Date.now() / 1000),
//         nanoseconds: 0,
//       },
//     };

//     sendMessage(messageText, chatId, user1, user2); // Novo: objetos completos
//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     setMessageText("");
//   };
//   // const handleSendMessage = (e) => {
//   //   e.preventDefault();
//   //   if (messageText.trim()) {
//   //     const newMessage = {
//   //     sender: senderEmail,
//   //     text: messageText,
//   //     timestamp: {
//   //       seconds: Math.floor(Date.now() / 1000),
//   //       nanoseconds: 0,
//   //     },
//   //   };
//   //   setMessages((prevMessages) => [...prevMessages, newMessage]);
//   //   sendMessage(messageText, chatId, user1, user2); // Novo: objetos completos
//   //   setMessageText("");
//   //   }
//   // };

//   return (
//     <section className="flex flex-col items-start justify-start h-screen w-[100%] background-image">
//       <header className="border-b border-gray-400 w-[100%] h-[82px] md:h-fit p-4 bg-white">
//         <main className="flex items-center gap-3">
//           <span>
//             <img
//               src={selectedUser?.image || defaultAvatar}
//               className="w-11 h-11 object-cover rounded-full"
//               alt=""
//             />
//           </span>
//           <span>
//             <h3 className="font-semibold text-[#2a3d39] text-lg">
//               {selectedUser?.fullName || "Usuário SmoothChat"}
//             </h3>
//             <p className="font-light text-[#2a3d39] text-sm">
//               @{selectedUser?.username || "smoothChat"}
//             </p>
//           </span>
//         </main>
//       </header>

//       <main className="custom-scrollbar relative h-[100vh] w-[100%] flex flex-col justify-between">
//         <section className="px-3 pt-5 pb-20 lg:pb-10">
//           <div ref={scrollRef} className="overflow-auto h-[80vh]">
//             {sortedMessages?.map((msg, index) => (
//               <>
//                 {msg?.sender === auth.currentUser.email ? (
//                   <div className="flex flex-col items-end w-full">
//                     <span className="flex gap-3 ms-10 h-auto mr-4">
//                       <div>
//                         <div className="flex items-center p-6 bg-white justify-center rounded-lg shadow-sm">
//                           <h4>{msg.text}</h4>
//                         </div>
//                         <p className="text-gray-400 text-xs mt-3">
//                           {formatTimestamp(msg?.timestamp)}
//                         </p>
//                       </div>
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-start w-full">
//                     <span className="flex gap-3 h-auto ms-10 mr-4">
//                       <img
//                         src={defaultAvatar}
//                         className="h-11 w-11 rounded-full object-cover"
//                         alt=""
//                       />
//                       <div>
//                         <div className="flex items-center p-6 bg-white justify-center rounded-lg shadow-sm">
//                           <h4>{msg.text}</h4>
//                         </div>
//                         <p className="text-gray-400 text-xs mt-3">
//                           {formatTimestamp(msg?.timestamp)}
//                         </p>
//                       </div>
//                     </span>
//                   </div>
//                 )}
//               </>
//             ))}
//           </div>
//         </section>
//         <div className="sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-full">
//           <form
//             onSubmit={handleSendMessage}
//             action=""
//             className="flex items-center bg-white h-[45px] w-full px-2 rounded-lg relative shadow-lg"
//           >
//             <input
//               value={messageText}
//               onChange={(e) => setMessageText(e.target.value)}
//               className="h-full text-[#2a3d39] outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-full"
//               type="text"
//               placeholder="Digite sua mensagem"
//             />
//             <button
//               type="submit"
//               className="flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#d9f2ed] hover:bg-[#c8eae3]"
//             >
//               <RiSendPlaneFill color="#01AA85" />
//             </button>
//           </form>
//         </div>
//       </main>
//     </section>
//   );
//   // return (
//   // <>
//   //   {selectedUser ? (
//   //     <section className="flex flex-col items-start justify-start h-screen w-[100%] bg-[#e5f6f3]">
//   //       <header className="border-b border-red w-[100%] h-[70px] md:fit p-4 bg-[#ffffff]">
//   //         <main className="flex items-center gap-3">
//   //           <span className="relative">
//   //             <img className="h-11 w-11 object-cover rounded-full" src={selectedUser?.image || defaultAvatar} alt="Usuário" />
//   //              </span>
//   //           <span>
//   //             <h3 className="font-semibold text-[#2a3d39] text-lg">{selectedUser?.fullName}</h3>
//   //             <p className="font-light text-[#2a3d39] text-sm">@{selectedUser?.username}</p>
//   //           </span>
//   //         </main>
//   //       </header>
//   //       <main className="custom-scrollbar background-image relative h-[100vh] w-[100%] flex flex-col justify-between">
//   //         <section className="px-3 pt-5 pb-20 lg:pb-10">
//   //           <div ref={scrollRef} className="overflow-auto h-[80vh] custom-scrollbar">
//   //             {sortedMessages.map((msg, index) => (
//   //               <div key={index} className={`flex ${ ms.sender === senderEmail ? "flex-col items-end w-full" : "flex-col items-start w-full" } //aligns messages from the other user to the left
//   // gap-5 mb-7`}
//   // >
//   // {msg.sender === senderEmail ? ( // Checks if the message was sent by the current user
//   //                                 <span className="flex gap-3 me-10">
//   //                                     <div className="h-auto">
//   //                                         <div className="flex items-center justify-center rounded-lg bg-[#fff] p-6 shadow-sm">
//   //                                             <h4 className="font-medium text-[17px] text-gray-800 w-full break-words">
//   //                                                 {msg.text}
//   //                                             </h4>
//   //                                         </div>
//   //                                         <p className="text-[#2A3D396E] text-xs text-right">
//   //                                             {formatTimestamp(msg?.timestamp)} {/* Formats and shows the timestamp */}
//   //                                         </p>
//   //                                     </div>
//   //                                 </span>
//   //                             ) : (
//   //                                 <span className="flex gap-3 w-[40%] h-auto ms-10">
//   //                                 <img className="h-11 w-11 object-cover rounded-full" src={selectedUser?.image || defaultAvatar} alt="User" />
//   //                                     <div>
//   //                                         <div className="flex items-center justify-center rounded-lg bg-[#fff] p-6 w-full shadow-sm">
//   //                                             <h4 className="font-medium text-[17px] text-gray-800 w-full break-words">
//   //                                                 {msg.text} </h4>
//   //                                         </div>
//   //                                         <p className="text-[#2A3D396E] text-xs">
//   //                                             {formatTimestamp(msg?.timestamp)}
//   //                                         </p>
//   //                                     </div>
//   //                                 </span>
//   //                             )}
//   //                         </div>
//   //                     ))}
//   //                 </div>
//   //             </section>
//   //             <div className="sticky lg:bottom-0 bottom-[60px] p-3 h-fit w-[100%] ">
//   //                 <form onSubmit={handleSendMessage} className="flex items-center bg-white h-[45px] w-[100%] px-2 rounded-lg relative shadow-lg">
//   //                     <input
//   //                         value={messageText} 
//   //                         onChange={(e) => setMessageText(e.target.value)}
//   //                         className="h-full text-[#2A3D39] outline-none text-[16px] pl-3 pr-[50px] rounded-lg w-[100%]"
//   //                         type="text"
//   //                         placeholder="Escreva sua mensagem..."
//   //                     />
// //             <button type="submit" className="flex items-center justify-center absolute right-3 p-2 rounded-full bg-[#D9F2ED] hover:bg-[#C8EAE3]" aria-label="Send message">
//   //                         <RiSendPlaneFill color="#01AA85" className="w-[18px] h-[18px]" />
//   //                     </button>
//   //                 </form>
//   //             </div>
//   //         </main>
//   //     </section>
//   // ) : (
//   //     <section className="h-screen w-[100%] bg-[#e5f6f3]">
//   //         <div className="flex flex-col justify-center items-center h-[100vh]">
//   //             <img src={logo} width={100} alt="" />
//   //             <h1 className="text-[30px] font-bold text-teal-700 mt-5">Bem vindo ao SmoothChat</h1>
//   //             <p className="text-gray-500">Conecte-se e converse com seus amigos facilmente</p>
//   //         </div>
//   //     </section>
//   // )
//   //}</>)
// };

// export default ChatBox;
