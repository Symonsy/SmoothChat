import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FaUserPlus } from "react-icons/fa";

const Register = ({ isLogin, setIsLogin }) => {
  const [userData, setUserdata] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData?.email,
        userData?.password
      );
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email.split("@")[0],
        fullName: userData?.fullName,
        image: "",
        status: "online",
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-[100vh] background-image">
      <div className="bg-white shadow-lg p-5 rounded-xl h-[27rem] w-[20rem] flex flex-col justify-center items-center">
        <div className="mb-10">
          <h1 className="text-center text-[28px] font-bold">Registre-se</h1>
          <p className="text-center text-sm text-gray-400">
            Bem vindo, crie uma conta para continuar
          </p>
        </div>
        <div className="w-full">
          <input
            type="text"
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
            placeholder="Nome"
            value={userData?.fullName}
            name="fullName"
            onChange={handleChangeUserData}
          />
          <input
            type="email"
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
            placeholder="Email"
            value={userData?.email}
            name="email"
            onChange={handleChangeUserData}
          />{" "}
          <br />
          <input
            type="password"
            className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
            placeholder="Senha"
            value={userData?.password}
            name="password"
            onChange={handleChangeUserData}
          />
        </div>
        <div className="w-full">
          <button
            className="bg-[#01aa85] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center"
            onClick={handleAuth}
          >
            {isLoading ? (
              <>Carregando...</>
            ) : (
              <>
                Registrar <FaUserPlus />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Register;

// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";

// import { auth, db } from "../firebase/firebase";
// import { setDoc, doc } from "firebase/firestore";
// import { FaUserPlus } from "react-icons/fa";

// const Register = ({ isLogin, setIsLogin }) => {
//   const [userData, setUserData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const handleChangeUserData = (e) => {
//     const { name, value } = e.target;

//     setUserData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
//   const handleAuth = async () => {
//     setIsLoading(true);
//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         userData?.email,
//         userData?.password
//       );
//       const user = userCredential.user;

//       const userDocRef = doc(db, "users", user.uid);
//       await setDoc(userDocRef, {
//         uid: user.uid,
//         email: user.email,
//         username: user.email?.split("@")[0],
//         fullName: userData.fullName,
//         image: "",
//         //status: "online",
//         //lastSeen: serverTimestamp(),
//       });
//     } catch (error) {
//       console.log(error);
//       //alert(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <section className="flex flex-col justify-center items-center h-[100vh] background-image">
//       <div className="bg-white shadow-lg p-5 rounded-xl h-[27rem] flex flex-col justify-center items-center">
//         <div className="mb-10">
//           <h1 className="text-center text-[28px] font-bold">Registre-se</h1>
//           <p className="text-center text-sm text-gray-400">
//             Bem-vindo, crie uma conta para continuar.
//           </p>
//         </div>
//         <div className="w-full">
//           <input
//             type="text"
//             name="fullName"
//             onChange={handleChangeUserData}
//             className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
//             placeholder="Nome de usuário"
//           />
//           <input
//             type="email"
//             onChange={handleChangeUserData}
//             className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
//             placeholder="Email"
//           //value={userData?.email}
//             name="email"
//           />
//           <input
//           //value={userData?.password}
//             type="password"
//             name="password"
//             onChange={handleChangeUserData}
//             className="border border-green-200 w-full p-2 rounded-md bg-[#01aa851d] text-[#004939f3] mb-3 font-medium outline-none placeholder:text-[#00493958]"
//             placeholder="Senha"
//           />
//         </div>
//         <div className="w-full">
//           <button
//             className="bg-[#01aa85] text-white font-bold w-full p-2 rounded-md flex items-center gap-2 justify-center "
//             disabled={isLoading} // Aparentemente,isso aqui parece não ser necessário, mas é bom manter, ou não?
//             onClick={handleAuth} // Isso aqui é necessário?
//           >
//             {isLoading ? (
//               <>Carregando...</>
//             ) : (
//               <>
//                 Registrar <FaUserPlus />
//               </>
//             )}
//           </button>

//           <div className="mt-5 text-center text-gray-400 text-sm">
//             <button onClick={() => setIsLogin(!isLogin)}>
//               Já possui uma conta? Faça login aqui
//             </button>
//         {/* <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Ainda não possui uma conta? Registre-se" : "Já possui uma conta? Faça login aqui"}</button> */}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Register;
