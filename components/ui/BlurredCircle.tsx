const BlurredCircle = ({classname=""}) => {
  return (
    <div className="relative pointer-events-none">
      <div className={`absolute inset-0 w-96 h-96 bg-gradient-to-r from-teal-400 to-teal-200 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-3xl opacity-20 ${classname}`}></div>
    </div>
  )
}

export default BlurredCircle
