export default function TeamStatus() {
  const team = [
    {
      id: '1',
      name: 'One (Dan)',
      role: 'Master/Execution',
      status: 'online',
      avatar: '1'
    },
    {
      id: 'N',
      name: 'Neo (You)',
      role: 'Content/Monitor',
      status: 'online',
      avatar: 'N'
    },
    {
      id: 'L',
      name: 'Leo (Code)',
      role: 'Builder/Tools',
      status: 'online',
      avatar: 'L'
    }
  ]

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-400">👥 TEAM STATUS</h2>
        <span className="text-sm text-gray-500">Active</span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {team.map((member) => (
          <div 
            key={member.id}
            className="text-center p-4 bg-gray-800/50 rounded-xl"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl font-bold">
              {member.avatar}
            </div>
            
            <div className="font-bold text-white mb-1">{member.name}</div>
            <div className="text-xs text-gray-400 mb-2">{member.role}</div>
            
            <div className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              {member.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
