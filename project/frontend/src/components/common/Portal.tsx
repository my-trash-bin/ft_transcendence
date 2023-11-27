import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children, selector }: { children: any; selector: any }) => {
  const portalRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    portalRef.current = document.querySelector(selector);
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, [selector]);

  return mounted && portalRef.current
    ? ReactDOM.createPortal(children, portalRef.current)
    : null;
};

export default Portal;
