
interface ButtonProps {
   label: string;
    classNames?: string;
   onClick?: () => void;
   disabled?: boolean;
   color?: string;
}

const Button = ({ label, classNames, onClick, disabled, color, ...rest }: ButtonProps) => {
   return (
      <div
         onClick={onClick}
         className={`button ${disabled ? 'disabled' : ''} ${classNames} px-4 py-2 rounded cursor-pointer text-white inline-block`}
         style={{ backgroundColor: color }}
         {...rest}
      >
         {label}
      </div>
   );
};

export default Button;
