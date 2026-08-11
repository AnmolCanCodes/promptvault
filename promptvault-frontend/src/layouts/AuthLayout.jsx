import Navbar from '../components/Navbar';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
