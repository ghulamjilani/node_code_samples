import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../assets/mes_single_logo.png";

export const _parameterize = (inputString) => {
  const words = inputString.split(" ");

  let result = words[0].toLowerCase();

  for (let i = 1; i < words.length; i++) {
    result += words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return result;
};

export function formatNumber(num) {
  if (isNaN(num)) return "0.00";

  // Convert the number to a string with two decimal places
  let fixedNumber = Number(num).toFixed(2);

  // Convert the fixed number to a locale-specific string with exactly two decimal places
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fixedNumber);
}

export function formatNumberWithoutRounding(num) {
  if (isNaN(num)) return "0.00";

  // Convert the number to a string
  let numStr = num.toString();

  // Split the string into integer and decimal parts
  let parts = numStr.split(".");

  // Get the first two decimal places without rounding
  let decimalPart = parts[1] ? parts[1].substring(0, 2) : "00";

  // Ensure the decimal part has exactly two digits
  if (decimalPart.length === 1) {
    decimalPart += "0";
  } else if (decimalPart.length === 0) {
    decimalPart = "00";
  }

  // Convert the integer part to a locale-specific string
  let integerPart = new Intl.NumberFormat("en-US").format(parts[0]);

  // Combine the formatted integer part with the unrounded decimal part
  return `${integerPart}.${decimalPart}`;
}

export function formatValue(value) {
  if (!value) return "£0.00";

  return "£" + formatNumber(value);
}

export function fullNameOfAdviser(user) {
  const firstName = user?.firstName ?? "";
  const middleName = user?.middleName ? " " + middleName + " " : " ";
  const lastName = user?.lastName ?? "";

  if (user?.role !== "financial_advisor") return false;

  return firstName + middleName + lastName;
}

export const handleDownloadCSV = (
  data,
  sheetName = "Sheet",
  excludeKeys = []
) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Extract headers dynamically from the first data object
  const headers = Object.keys(data[0])
    .filter((key) => !excludeKeys.includes(key.toLowerCase())) // Exclude specified keys
    .map((key) => key); // Keep headers as camelCase

  // Function to format dates
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  // Prepare data rows
  const dataRows = data.map((item) => {
    return headers
      .map((header) => {
        let value = item[header]; // Get value based on header (camelCase key)
        if (value === undefined || value === null) {
          value = ""; // Handle undefined or null values
        } else if (value instanceof Date) {
          value = formatDate(value); // Format date if necessary
        }
        return `"${value}"`;
      })
      .join(",");
  });

  // Construct CSV content
  const csvContent = [headers.join(","), ...dataRows].join("\n");

  // Trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${sheetName}_data.csv`;
  link.click();
  return true;
};

export const handleDownloadPDF = (data, sheetName, excludeKeys) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Extract headers dynamically from the first data object
  const headers = Object.keys(data[0])
    .filter((key) => !excludeKeys.includes(key))
    .map((key) => key); // Keep headers as camelCase

  // Function to format dates
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  // Function to format numbers
  const formatNumber = (value) => {
    if (isNaN(value)) return value;
    return value.toLocaleString();
  };

  // Prepare data rows
  const dataRows = data.map((item) => {
    return headers.map((header) => {
      let value = item[header]; // Get value based on header (camelCase key)
      if (value === undefined || value === null) {
        value = ""; // Handle undefined or null values
      } else if (value instanceof Date) {
        value = formatDate(value); // Format date if necessary
      } else if (header === "availableCash" || header === "portfolioValue") {
        value = formatNumber(parseFloat(value)); // Format number if necessary
      }
      return value;
    });
  });

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Add the table to the PDF
  doc.autoTable({
    head: [headers],
    body: dataRows,
    styles: {
      fontSize: 8,
    },
    headStyles: {
      fillColor: [3, 17, 41],
      textColor: [255, 255, 255],
    },
    margin: { top: 27, bottom: 27 }, // Increase margin if needed to avoid overlapping
    didDrawPage: (data) => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 20;
      const logoHeight = 20;
      const marginRight = 10; // Space from the right edge

      // Calculate x-coordinate for logo
      const x = pageWidth - logoWidth - marginRight;
      const y = 3; // Fixed y-coordinate from the top

      // Add the logo on top right corner of each page
      doc.addImage(logo, "PNG", x, y, logoWidth, logoHeight); // Adjust position and size as needed

      // Draw a light green horizontal line
      // Footer
      const footerY = doc.internal.pageSize.height - 20; // Position of footer from bottom
      const footerLineY = footerY - 0.5; // Position of the line, closer to the text

      // Draw a light green horizontal line
      doc.setDrawColor("#31D093"); // Light green color
      doc.setLineWidth(1.5);
      doc.line(10, footerLineY, pageWidth - 10, footerLineY); // Draw line from left to right

      // Add text below the line
      doc.setFontSize(9);
      // doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Black color for text
      doc.text(
        "MES Financial Services Limited is authorised and regulated by the Financial Conduct Authority, reference number 805568. The registered office address is 31 College Green, First Floor, Bristol, BS1 5TB. Telephone: +44 3303 202091.",
        10,
        footerY + 5, // Adjusted text position to be closer to the line
        { maxWidth: pageWidth - 20 }
      );
    },
  });

  // Save the PDF
  doc.save(`${sheetName}_data.pdf`);
  return true;
};

export function fullName(user) {
  const firstName = user?.firstName ?? "";
  const middleName = user?.middlename ? " " + user?.middlename + " " : " ";
  const lastName = user?.lastName ?? "";

  return firstName + middleName + lastName;
}
