import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { RxHamburgerMenu } from "react-icons/rx";

const History = () => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user?.userData);
  const credits = userData?.credits ?? 0;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/notes/getnotes", {
          withCredentials: true,
        });
        console.log(res.data);
        setTopics(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
      }
    };
    myNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-8">
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
      mb-10
      rounded-2xl
      bg-black/80
      backdrop-blur-xl
      border border-white/10
      px-8 py-6
      flex justify-between
      items-start md:items-center
      gap-4
      flex-wrap
      shadow-[0_20px_45px_rgba(0,0,0,0.6)]
    "
      >
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-2xl font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            Exam Notes AI
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            AI-powered exam-oriented notes and revision
          </p>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <button
            onClick={() => navigate("/pricing")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm"
          >
            <span className="text-xl">💎</span>
            <span>{credits}</span>
            <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              className="ml-2 h-5 w-5 flex items-center justify-center rounded-full bg-white text-xs font-bold"
            >
              ➕
            </motion.span>
          </button>
          <button className="lg:hidden text-white text-2xl">
            <RxHamburgerMenu />
          </button>
        </div>
      </motion.header>

      <div className=" grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        <AnimatePresence>
          {(isSidebarOpen || window.innerHTML >= 1024) && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "string", stiffness: 260, damping: 30 }}
              className="
fixed lg:static
top-0 left-0 z-50 lg:z-auto
w-72 lg:w-auto
h-full lg:h-[75vh]
lg:rounded-3xl
lg:col-span-1
bg-black/90 lg:bg-black/80
backdrop-blur-xl
border border-white/10
shadow-[0_20px_45px_rgba(0,0,0,0.6)]
p-5
overflow-y-auto
"
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white mb-4"
              >
                ⬅️ Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default History;
