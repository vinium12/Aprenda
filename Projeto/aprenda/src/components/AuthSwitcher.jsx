import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './Login';
import Cadastro from './Cadastro';

const variants = {
  initial: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute',
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: 'relative',
    transition: { duration: 0.5 },
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    position: 'absolute',
    transition: { duration: 0.5 },
  }),
};

export default function AuthSwitcher() {
  const [isLogin, setIsLogin] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = para esquerda, -1 = para direita

  const toggleForm = () => {
    setDirection(isLogin ? 1 : -1);
    setIsLogin(!isLogin);
  };

  return (
    <div className="relative w-full max-w-4xl h-[500px] mx-auto overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={isLogin ? 'login' : 'cadastro'}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          custom={direction}
        >
          {isLogin ? <Login onSwitch={toggleForm} /> : <Cadastro onSwitch={toggleForm} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
