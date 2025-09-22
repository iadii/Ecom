export default function AwsSesInfo() {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
      <h3 className="text-lg font-semibold text-[#222222] mb-4">AWS SES Quick Reference</h3>
      
      {/* Pricing */}
      <div className="mb-6">
        <h4 className="font-medium text-[#6C1D57] mb-3">💰 Pricing (2024)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-[#F5F5F7] p-3 rounded-md">
            <div className="font-medium text-[#222222]">Free Tier</div>
            <div className="text-[#555555]">62,000 emails/month when sent from EC2</div>
          </div>
          <div className="bg-[#F5F5F7] p-3 rounded-md">
            <div className="font-medium text-[#222222]">Paid Tier</div>
            <div className="text-[#555555]">$0.10 per 1,000 emails</div>
          </div>
        </div>
      </div>

      {/* Limits */}
      <div className="mb-6">
        <h4 className="font-medium text-[#6C1D57] mb-3">📊 Sending Limits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-[#222222] mb-2">Sandbox Mode</div>
            <ul className="text-sm text-[#555555] space-y-1">
              <li>• 200 emails per day</li>
              <li>• 1 email per second</li>
              <li>• Verified recipients only</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium text-[#222222] mb-2">Production Mode</div>
            <ul className="text-sm text-[#555555] space-y-1">
              <li>• Starts at 200/day, increases over time</li>
              <li>• Up to 14 emails per second</li>
              <li>• Any recipient address</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Regions */}
      <div className="mb-6">
        <h4 className="font-medium text-[#6C1D57] mb-3">🌍 Available Regions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>US East (Virginia)</span>
            <code className="text-[#6C1D57]">us-east-1</code>
          </div>
          <div className="flex justify-between">
            <span>US West (Oregon)</span>
            <code className="text-[#6C1D57]">us-west-2</code>
          </div>
          <div className="flex justify-between">
            <span>Europe (Ireland)</span>
            <code className="text-[#6C1D57]">eu-west-1</code>
          </div>
          <div className="flex justify-between">
            <span>Asia Pacific (Mumbai)</span>
            <code className="text-[#6C1D57]">ap-south-1</code>
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h4 className="font-medium text-[#6C1D57] mb-3">✨ Key Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>99%+ delivery rates</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Built-in DKIM signing</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Bounce & complaint handling</span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Real-time analytics</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>IP reputation management</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span>Scalable infrastructure</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}