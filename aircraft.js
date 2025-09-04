// Check if user is logged in and populate Klaviyo tracking with session data
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const userEmail = Cookies.get("userEmail");
  const authToken = Cookies.get("authToken");
  const isLoggedIn = userEmail && authToken;

  if (isLoggedIn) {
    // Get user details from session storage
    const userDetailsStr = sessionStorage.getItem("userDetails");

    if (userDetailsStr) {
      try {
        const userDetails = JSON.parse(userDetailsStr);

        // Update Klaviyo tracking scripts with real user data
        updateKlaviyoTracking(userDetails);
      } catch (e) {
        console.error("Failed to parse user details from session", e);
        // Fallback to email only if session data is corrupted
        if (userEmail) {
          updateKlaviyoTracking({ email: userEmail });
        }
      }
    } else if (userEmail) {
      // Fallback to email only if no session data
      updateKlaviyoTracking({ email: userEmail });
    }
  }
});

// Function to update Klaviyo tracking with user data
function updateKlaviyoTracking(userDetails) {
  const email = userDetails.email;
  const firstName = userDetails.firstName;
  const lastName = userDetails.lastName;
  const phone = userDetails.phone;

  // Update _learnq tracking
  if (window._learnq && Array.isArray(window._learnq)) {
    window._learnq.push([
      "identify",
      {
        $email: email,
      },
    ]);
  }

  // Update Klaviyo identify
  if (
    typeof window.klaviyo !== "undefined" &&
    typeof window.klaviyo.identify === "function"
  ) {
    window.klaviyo.identify({
      $email: email,
      $first_name: firstName,
      $last_name: lastName,
      $phone_number: phone,
    });
  }

  console.log("Klaviyo tracking updated with user data:", {
    email: email,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
  });
}
