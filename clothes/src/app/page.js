export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Home</h1>
      <p className="mt-2 text-gray-600">
        Welcome to the Clothes Management System. This dashboard provides a quick overview of your sales, customers, and products.
      </p>

      {/* Sidebar guide */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Getting Started with the Sidebar</h2>
        <p className="text-gray-600">
          The sidebar on the left helps you navigate through different sections of the system:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Dashboard:</strong> Your main overview page with key stats and recent activity.
          </li>
          <li>
            <strong>Customers:</strong> View, add, or edit customer information.
          </li>
          <li>
            <strong>Products:</strong> Manage your product inventory, pricing, and details.
          </li>
          <li>
            <strong>Sales:</strong> Check recent sales, generate reports, and track revenue.
          </li>
        </ul>
        <p className="text-gray-600">
          Click on any item in the sidebar to access that section quickly. The sidebar remains visible on all pages for easy navigation.
        </p>
      </div>

      {/* Tips section */}
      <div className="bg-blue-50 p-4 rounded-lg text-gray-800">
        <h3 className="font-semibold">Tip:</h3>
        <p>
          Use the sidebar to quickly switch between sections. Hover over icons to see tooltips if available. Always keep your data updated for accurate reports.
        </p>
      </div>
    </div>
  );
}
