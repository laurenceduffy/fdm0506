import { useEffect } from "react/cjs/react.development";

const useDropdownCloser = (ref, setState) => {
    useEffect(() => {
        const handleClick = event => {
            if (ref.current && !ref.current.contains(event.target)) {
                setState(false);
            }
        }

        const handleKeyPress = event => {
            if (event.key === "Escape") {
                setState(false);
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClick);
        document.body.addEventListener('keydown', handleKeyPress);
        
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [ref, setState]);
}

export { useDropdownCloser }