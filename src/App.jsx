import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation  } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, PhotoIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { auth } from './firebase';

//IMPOR COMPANY TABLE
import CompanyPage from "./Pages/CompaniesPage";
import ReportsPage from "./Pages/ReportsPage";
import Dashboard from "./Pages/Dashboard";
import ReportsView from "./Modules/Reporting/ReportFinal";
import LoginPage from "./Modules/Security/Login";


  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        // Sign-out successful.
        console.log('User signed out successfully.');
      })
      .catch((error) => {
        // An error happened.
        console.error('Error occurred during sign-out:', error);
      });
  };  

const navigation = [
  { name: 'Dashboard', href: '/', current: false },
  { name: 'Reports', href: '/reports', current: false },
  { name: 'Companies', href: '/companies', current: false },
  { name: '', href: '/login', current: false },
  // { name: 'Calendar', href: '#', current: false },
]

const userNavigation = [
  // { name: 'Your Profile', href: '#' },
  // { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#', onClick: handleSignOut },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function DynamicPageTitle() {
  const location = useLocation();
  const [currentRouteName, setCurrentRouteName] = useState('');

  useEffect(() => {
    const currentRoute = navigation.find((item) => item.href === location.pathname);
    if (currentRoute) {
      setCurrentRouteName(currentRoute.name);
      document.title = `Reporting Tool - ${currentRoute.name}`;
    }
  }, [location.pathname]);

  return <h1 className="text-3xl font-bold tracking-tight text-white">{currentRouteName}</h1>;
}


export default function App() {
 
  const [userAuthenticated, setUserAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: 'Chykalophia',
    email: 'support@chykalophia.com',
    imageUrl: 'http://chykalophia.com/wp-content/uploads/2019/08/cropped-CKLPH_Favicon-192x192.png',
  });

  useEffect(() => {
    console.log('Base Path:', window.location.pathname);
    const unsubscribe = auth.onAuthStateChanged((users) => {
      // Check user authentication status
      if (users) {
      // Check if the user's email belongs to the allowed domain
      if (users.email && users.email.includes('@chykalophia.com') || users.email.includes('juancarlos.deborja@gmail.com')) {
        // User is signed in and has an allowed email address
        setUserAuthenticated(true);
      } else {
        // User is signed in but has a disallowed email address
        // Sign the user out or handle the unauthorized access accordingly
        setUserAuthenticated(false);
        auth.signOut(); // Sign out the unauthorized user
      }

      // Fetch additional user data here
      // For example, if you have a users collection in Firestore, you can fetch user data based on the user's UID.
      // Once you have the user data, update the state and set loading to false.
      // For demonstration purposes, I'll assume you have the user data available directly from Firebase.
      const { displayName, email, photoURL } = users;
      setUser({
        name: displayName || 'Chykalophia',
        email: email || 'support@chykalophia.com',
        imageUrl: photoURL || null,
      });
      setLoading(false); // Data loaded, set loading to false      


      } else {
        // User is signed out
        setUserAuthenticated(false);

        setUser({
          name: 'Chykalophia',
          email: 'support@chykalophia.com',
          imageUrl: 'http://chykalophia.com/wp-content/uploads/2019/08/cropped-CKLPH_Favicon-192x192.png',
        });
        setLoading(false); // No user data, set loading to false

      }
    });
    
  
    // Cleanup the observer on component unmount
    return () => {
      unsubscribe();
    };
  }, []);  

  return (
    <Router basename="/">
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}

   
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-8 w-8"
                            src="http://chykalophia.com/wp-content/uploads/2019/08/cropped-CKLPH_Favicon-192x192.png"
                            alt="Chykalophia"
                          />
                        </div>
                        <div className="hidden md:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                            {navigation.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                  'rounded-md px-3 py-2 text-sm font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                              >
                                {item.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                          <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                          >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                          </button>

                          {/* Profile dropdown */}
                          <Menu as="div" className="relative ml-3">
                            <div>
                              <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      onClick={(e) => {
                                        e.preventDefault(); // Prevent the default anchor tag behavior
                                        if (item.onClick) {
                                          item.onClick(); // Call the sign-out function
                                        }
                                      }}
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'block px-4 py-2 text-sm text-gray-700'
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}

                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                          ) : (
                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                  <div className="space-y-1 px-2 py-3 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block rounded-md px-3 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">{user.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                      </div>
                      <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <DynamicPageTitle />
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              {/* Protected Routes */}
              {userAuthenticated ? (
                <>
                
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/reports/view" element={<ReportsView />} />
                  <Route path="/companies" element={<CompanyPage />} />
                  {/* Add more protected routes for other components as needed */}
                </>
              ) : (
                // Redirect to login page if user is not authenticated
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
            



            </div>
          </div>
        </main>
      </div>
    </Router>
  )
}
