function Button({
  children,
  type="button"  ,
  bgColour="bg-[#08e6f5]",
  textColour="text-black",
  className="",
  ...props
}){
    return(
        <button type={type} className={`px-4 py-2 rounded-lg ${bgColour} ${textColour} ${className}`}{...props}
        >{children}</button>
    )

}
export default Button