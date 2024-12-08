import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="w-full scroll-smooth">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50 h-20">
        <div className="flex justify-between items-center w-full px-8 h-full">
          {/* Logo */}
          <div className="flex items-center animate-fade-in">
            <Image src="/logo.png" alt="LeetConnect Logo" width={220} height={220} className="h-full w-auto" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8 text-lg font-semibold text-gray-700">
            <a
              href="#home"
              className="hover:text-green-500 transition-transform transform hover:scale-105"
            >
              Home
            </a>
            <a
              href="#about-us"
              className="hover:text-green-500 transition-transform transform hover:scale-105"
            >
              About Us
            </a>
            <a
              href="#services"
              className="hover:text-green-500 transition-transform transform hover:scale-105"
            >
              Services
            </a>
            <a
              href="#explore"
              className="hover:text-green-500 transition-transform transform hover:scale-105"
            >
              Explore
            </a>
          </nav>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Link href="/signin">
              <button className="px-6 py-2 text-lg font-semibold bg-green-500 text-white rounded hover:bg-green-600 transition-all">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="px-6 py-2 text-lg font-semibold bg-green-500 text-white rounded hover:bg-blue-600 transition-all">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Home Section */}
      <section
        id="home"
        className="relative flex flex-wrap items-center justify-between py-32 px-8 bg-gradient-to-r from-green-500 to-white text-white mt-20"
      >
        <div className="max-w-lg" data-aos="fade-right">
          <h1 className="text-6xl font-bold text-white leading-tight animate-bounce">
            Empower Your <span className="text-black">Learning Journey</span>
          </h1>
          <p className="mt-6 text-lg text-white leading-relaxed">
            LeetConnect is your ultimate platform to master coding, evaluate assignments, and grow your skills through
            cutting-edge integrations.
          </p>
          <button className="mt-8 px-8 py-4 bg-white text-green-600 font-medium rounded-lg shadow-md hover:bg-green-600 hover:text-white transition-all animate-pulse">
            Get Started
          </button>
        </div>
        <div data-aos="fade-left">
          <Image src="/home.png" alt="Learning Platform" width={500} height={500} className="rounded-lg shadow-lg" />
        </div>
        <div className="absolute bottom-[-20px] left-0 w-full flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full text-green-500"
            fill="currentColor"
          >
            <path
              fillOpacity="1"
              d="M0,96L48,128C96,160,192,224,288,240C384,256,480,224,576,186.7C672,149,768,107,864,101.3C960,96,1056,128,1152,165.3C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about-us"
        className="py-24 px-8 bg-gradient-to-r from-white to-green-50 relative overflow-hidden"
      >
        <div className="container mx-auto">
          <h2
            className="text-5xl font-bold text-center text-gray-800 mb-8"
            data-aos="fade-down"
          >
            About Us
          </h2>
          <p
            className="text-center text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
          >
            At <span className="text-green-600 font-bold">LeetConnect</span>, we
            strive to revolutionize the way educators and students interact. Our
            platform seamlessly integrates{" "}
            <span className="text-green-500">Google Classroom</span> and{" "}
            <span className="text-green-500">Judge0</span>, making it easier to
            manage coding assignments, evaluate results, and provide instant
            feedback, fostering a smarter and more engaging learning experience.
          </p>

          {/* Feature Highlights */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 items-center"
            data-aos="fade-up"
          >
            {/* Left Side Text */}
            <div className="space-y-6">
              <div
                className="flex items-start space-x-4"
                data-aos="fade-right"
              >
                <Image
                  src="/classroom.png"
                  alt="Google Classroom"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold text-green-600">
                    Google Classroom
                  </h3>
                  <p className="text-gray-600">
                    Efficiently manage class materials, assignments, and
                    announcements.
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-4"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <Image
                  src="/judge.png"
                  alt="Judge0 Integration"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold text-green-600">
                    Judge0 Integration
                  </h3>
                  <p className="text-gray-600">
                    Automatically evaluate coding assignments in multiple
                    programming languages.
                  </p>
                </div>
              </div>
              <div
                className="flex items-start space-x-4"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <Image
                  src="/aboutus2.png"
                  alt="Real-Time Feedback"
                  width={60}
                  height={60}
                  className="rounded-full shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold text-green-600">
                    Real-Time Feedback
                  </h3>
                  <p className="text-gray-600">
                    Enable students to improve faster with instant feedback on
                    their work.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Image */}
            <div className="relative">
              <Image
                src="/aboutus1.png"
                alt="About Us"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-aos="fade-left"
              />
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
<section
  id="services"
  className="py-24 px-8 bg-gradient-to-r from-green-50 to-white relative"
>
  <div className="container mx-auto">
    <h2
      className="text-5xl font-bold text-center text-gray-800 mb-8"
      data-aos="fade-down"
    >
      Our Services
    </h2>
    <p
      className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12"
      data-aos="fade-up"
    >
      Discover how <span className="text-green-600 font-bold">LeetConnect</span>{" "}
      transforms learning with innovative tools like Google Classroom
      integration, Judge0 evaluation, and real-time feedback. We empower both
      educators and students with seamless experiences and data-driven insights.
    </p>

    {/* Service Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      <div
        className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
        data-aos="fade-right"
      >
        <Image
          src="/classroom.png"
          alt="Google Classroom"
          width={100}
          height={100}
          className="mx-auto"
        />
        <h3 className="text-3xl font-bold text-green-600 text-center mt-6">
          Google Classroom Integration
        </h3>
        <p className="text-gray-600 text-center mt-4 leading-relaxed">
          Manage class materials, assignments, and announcements effortlessly
          with seamless Google Classroom integration.
        </p>
      </div>
      <div
        className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
        data-aos="fade-up"
      >
        <Image
          src="/judge.png"
          alt="Judge0 Integration"
          width={100}
          height={100}
          className="mx-auto"
        />
        <h3 className="text-3xl font-bold text-green-600 text-center mt-6">
          Judge0 Integration
        </h3>
        <p className="text-gray-600 text-center mt-4 leading-relaxed">
          Automatically evaluate coding assignments with support for multiple
          programming languages via Judge0 API.
        </p>
      </div>
      <div
        className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
        data-aos="fade-left"
      >
        <Image
          src="/feedback.png"
          alt="Real-Time Feedback"
          width={100}
          height={100}
          className="mx-auto"
        />
        <h3 className="text-3xl font-bold text-green-600 text-center mt-6">
          Real-Time Feedback
        </h3>
        <p className="text-gray-600 text-center mt-4 leading-relaxed">
          Provide students with instant feedback to help them improve their
          skills and achieve their learning goals faster.
        </p>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute -top-12 -right-12 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
  </div>
</section>

      {/* Explore Section */}
<section
  id="explore"
  className="py-24 px-8 bg-gradient-to-l from-green-50 to-white relative overflow-hidden"
>
  <div className="container mx-auto">
    <h2
      className="text-5xl font-bold text-center text-gray-800 mb-8"
      data-aos="fade-down"
    >
      Explore Our Platform
    </h2>
    <p
      className="text-center text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12"
      data-aos="fade-up"
    >
      Discover the unique features of{" "}
      <span className="text-green-600 font-bold">LeetConnect</span>. From
      personalized dashboards to advanced analytics, we offer everything you
      need to track progress, gain insights, and create an engaging learning
      experience.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Feature 1 */}
      <div
        className="flex flex-col items-center text-center space-y-4"
        data-aos="fade-right"
      >
        <Image
          src="/explore1.png"
          alt="Personalized Dashboards"
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
        <h3 className="text-3xl font-bold text-green-600">
          Personalized Dashboards
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Get a comprehensive overview of assignments, deadlines, and
          performance with user-friendly dashboards.
        </p>
      </div>

      {/* Feature 2 */}
      <div
        className="flex flex-col items-center text-center space-y-4"
        data-aos="fade-left"
      >
        <Image
          src="/explore2.png"
          alt="Advanced Analytics"
          width={400}
          height={300}
          className="rounded-lg shadow-lg"
        />
        <h3 className="text-3xl font-bold text-green-600">
          Advanced Analytics
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Measure student performance and gain actionable insights with
          real-time data analytics.
        </p>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute -top-16 -right-16 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
    <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
  </div>
</section>
      {/* Footer */}
      <footer className="w-full bg-gray-100 py-6">
        <div className="px-8 text-center">
          <p>&copy; 2024 LeetConnect. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4 text-gray-600">
            <a href="#">About Us</a>
            <a href="#">Help</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
