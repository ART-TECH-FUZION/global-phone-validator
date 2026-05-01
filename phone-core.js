const countries = [
  // South Asia
  { name: "India", code: "+91", flag: "🇮🇳", min: 10, max: 10, regex: /^[6-9]\d{9}$/ },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", min: 10, max: 10, regex: /^3\d{9}$/ },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩", min: 10, max: 10, regex: /^1\d{9}$/ },
  { name: "Nepal", code: "+977", flag: "🇳🇵", min: 10, max: 10, regex: /^(98|97)\d{8}$/ },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰", min: 9, max: 9, regex: /^7\d{8}$/ },

  // North America
  { name: "United States", code: "+1", flag: "🇺🇸", min: 10, max: 10, regex: /^[2-9]\d{9}$/ },
  { name: "Canada", code: "+1", flag: "🇨🇦", min: 10, max: 10, regex: /^[2-9]\d{9}$/ },

  // Europe
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", min: 10, max: 10, regex: /^7\d{9}$/ },
  { name: "Germany", code: "+49", flag: "🇩🇪", min: 10, max: 11, regex: /^1\d{9,10}$/ },
  { name: "France", code: "+33", flag: "🇫🇷", min: 9, max: 9, regex: /^[67]\d{8}$/ },
  { name: "Italy", code: "+39", flag: "🇮🇹", min: 9, max: 10, regex: /^3\d{8,9}$/ },
  { name: "Spain", code: "+34", flag: "🇪🇸", min: 9, max: 9, regex: /^[67]\d{8}$/ },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", min: 9, max: 9, regex: /^6\d{8}$/ },
  { name: "Poland", code: "+48", flag: "🇵🇱", min: 9, max: 9, regex: /^[5-7]\d{8}$/ },
  { name: "Sweden", code: "+46", flag: "🇸🇪", min: 9, max: 9, regex: /^7\d{8}$/ },
  { name: "Norway", code: "+47", flag: "🇳🇴", min: 8, max: 8, regex: /^[49]\d{7}$/ },
  { name: "Denmark", code: "+45", flag: "🇩🇰", min: 8, max: 8, regex: /^[2-9]\d{7}$/ },
  { name: "Ukraine", code: "+380", flag: "🇺🇦", min: 9, max: 9, regex: /^9\d{8}$/ },
  { name: "Russia", code: "+7", flag: "🇷🇺", min: 10, max: 10, regex: /^9\d{9}$/ },

  // Middle East
  { name: "UAE", code: "+971", flag: "🇦🇪", min: 9, max: 9, regex: /^5\d{8}$/ },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦", min: 9, max: 9, regex: /^5\d{8}$/ },
  { name: "Turkey", code: "+90", flag: "🇹🇷", min: 10, max: 10, regex: /^5\d{9}$/ },
  { name: "Israel", code: "+972", flag: "🇮🇱", min: 9, max: 9, regex: /^5\d{8}$/ },

  // Asia Pacific
  { name: "China", code: "+86", flag: "🇨🇳", min: 11, max: 11, regex: /^1\d{10}$/ },
  { name: "Japan", code: "+81", flag: "🇯🇵", min: 10, max: 11, regex: /^[789]0\d{8}$/ },
  { name: "South Korea", code: "+82", flag: "🇰🇷", min: 9, max: 10, regex: /^1\d{8,9}$/ },
  { name: "Singapore", code: "+65", flag: "🇸🇬", min: 8, max: 8, regex: /^[89]\d{7}$/ },
  { name: "Indonesia", code: "+62", flag: "🇮🇩", min: 10, max: 12, regex: /^8\d{9,11}$/ },
  { name: "Malaysia", code: "+60", flag: "🇲🇾", min: 9, max: 10, regex: /^1\d{8,9}$/ },
  { name: "Thailand", code: "+66", flag: "🇹🇭", min: 9, max: 9, regex: /^[689]\d{8}$/ },
  { name: "Vietnam", code: "+84", flag: "🇻🇳", min: 9, max: 10, regex: /^9\d{8,9}$/ },
  { name: "Philippines", code: "+63", flag: "🇵🇭", min: 10, max: 10, regex: /^9\d{9}$/ },

  // Africa
  { name: "South Africa", code: "+27", flag: "🇿🇦", min: 9, max: 9, regex: /^6\d{8}$/ },
  { name: "Nigeria", code: "+234", flag: "🇳🇬", min: 10, max: 10, regex: /^[789]\d{9}$/ },
  { name: "Kenya", code: "+254", flag: "🇰🇪", min: 9, max: 9, regex: /^7\d{8}$/ },
  { name: "Egypt", code: "+20", flag: "🇪🇬", min: 10, max: 10, regex: /^1\d{9}$/ },

  // Oceania
  { name: "Australia", code: "+61", flag: "🇦🇺", min: 9, max: 9, regex: /^4\d{8}$/ },
  { name: "New Zealand", code: "+64", flag: "🇳🇿", min: 9, max: 10, regex: /^2\d{8,9}$/ }
];

window.PhoneCore = (function () {

  function getCountries() {
    return countries;
  }

  function findCountry(code) {
    return countries.find(c => c.code === code);
  }

  function detectCountry(number) {
    const clean = number.replace(/\D/g, "");
    return countries.find(c =>
      clean.startsWith(c.code.replace("+", ""))
    );
  }

  function validate(number, country) {
    const clean = number.replace(/\D/g, "");

    if (!country) return { valid: false, error: "No country selected" };
    if (clean.length < country.min) return { valid: false, error: "Too short" };
    if (clean.length > country.max) return { valid: false, error: "Too long" };
    if (!country.regex.test(clean)) return { valid: false, error: "Invalid format" };

    return { valid: true, error: null };
  }

  function format(number) {
    const clean = number.replace(/\D/g, "");
    return clean.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3");
  }

  return {
    getCountries,
    findCountry,
    detectCountry,
    validate,
    format
  };

})();
