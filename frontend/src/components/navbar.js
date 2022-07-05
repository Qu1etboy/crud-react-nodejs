const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/';
  }

  return (
    <div className="w-full bg-blue-500 shadow-md text-white px-10 py-5 mb-5">
      <div className="flex justify-between">
        <div>Qu1etboy's post</div>
        <div className="cursor-pointer" onClick={handleLogout}>Logout</div>
      </div>
    </div>
  )
}

export default Navbar;