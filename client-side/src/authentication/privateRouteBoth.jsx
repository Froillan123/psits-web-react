import backendConnection from "../api/backendApi";
import { setInformationData } from "./Authentication";
import axios from "axios";
import { React, useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import DocsLoginModal from "../components/docs/DocsLoginModal";

const PrivateRouteBoth = ({ element: Component }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const checkAuthentication = async () => {
    // Get fresh token from sessionStorage each time
    const token = sessionStorage.getItem("Token");

    if (!token) {
      // No token, show modal
      setIsAuthenticated(false);
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      // Only check admin route - docs are Admin-only
      const adminResponse = await axios.get(
        `${backendConnection()}/api/protected-route-admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInformationData(adminResponse.data.user, adminResponse.data.user.role);

      if (adminResponse.data.user.role === "Admin") {
        setIsAuthenticated(true);
        setShowModal(false);
        setLoading(false);
        return;
      } else {
        // Not an admin, show modal
        console.error("Not authorized - Admin access only");
        setIsAuthenticated(false);
        setShowModal(true);
        setLoading(false);
      }
    } catch (error) {
      // Authentication failed, show modal
      console.error("Not authorized for docs access");
      setIsAuthenticated(false);
      setShowModal(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLoginSuccess = () => {
    // Recheck authentication after successful login with fresh token
    setShowModal(false);
    setIsAuthenticated(false);
    setLoading(true);

    // Small delay to ensure token is saved in sessionStorage
    setTimeout(() => {
      checkAuthentication();
    }, 100);
  };

  const handleModalClose = () => {
    // User cancelled login - redirect to home
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="flex justify-center items-center h-60vh">
          <InfinitySpin
            visible={true}
            width={200}
            color="#0d6efd"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Component />;
  }

  if (showModal) {
    return (
      <DocsLoginModal
        onClose={handleModalClose}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return null;
};

export default PrivateRouteBoth;
