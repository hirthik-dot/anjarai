import { NavLink } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { 
  BarChart3, Box, Image as ImageIcon, Megaphone, Leaf, 
  Award, Sparkles, Tag, Heart, Info, PlayCircle, 
  Mail, Link as LinkIcon, Gift, LogOut, ExternalLink, 
  User, ShieldCheck, Compass, LayoutList, Factory, History, ClipboardList, Users, Flag
} from 'lucide-react';

const NAV_GROUPS = [
  { group: 'STORE CONTENT', items: [
    { icon: BarChart3,  label: 'Dashboard',     path: '/dashboard'     },
    { icon: Compass,    label: 'Navbar Setup',  path: '/navbar'        },
    { icon: Box,        label: 'Products',      path: '/products'      },
    { icon: Tag,        label: 'Collections',   path: '/collections'   },
    { icon: ImageIcon,  label: 'Hero Slides',   path: '/hero'          },
    { icon: Megaphone,  label: 'Announcement',  path: '/announcements' },
    { icon: Leaf,       label: 'Tagline Bar',   path: '/tagline'       },
  ]},
  { group: 'SECTIONS', items: [
    { icon: Award,      label: 'Trust Bar',     path: '/trust'         },
    { icon: Sparkles,   label: 'Marquee Strip', path: '/marquee'       },
    { icon: LayoutList, label: 'Categories',    path: '/categories'    },
    { icon: Heart,      label: 'About Strip',   path: '/about'         },
    { icon: Info,       label: 'Ad Banners',    path: '/ads'           },
    { icon: Flag,       label: 'Closing Banner', path: '/closing-banner' },
    { icon: PlayCircle, label: 'Videos',        path: '/videos'        },
  ]},
  { group: 'INVENTORY', items: [
    { icon: Factory,       label: 'Current Stock', path: '/inventory'     },
    { icon: History,       label: 'Stock History', path: '/inventory-history' },
    { icon: ClipboardList, label: 'Reports',       path: '/inventory-reports' },
  ]},
  { group: 'BUSINESS', items: [
    { icon: Mail,       label: 'Newsletter',    path: '/newsletter'    },
    { icon: LinkIcon,   label: 'Footer',        path: '/footer'        },
    { icon: Gift,       label: 'Offers/Promo',  path: '/offers'        },
    { icon: Users,      label: 'Client Users',  path: '/clients'       },
  ]},
  { group: 'ACCOUNT', items: [
    { icon: User,        label: 'My Profile',      path: '/profile'           },
    { icon: ShieldCheck, label: 'Security',        path: '/change-password'   },
  ]},
];

export default function AdminSidebar() {
  const { admin, logout } = useAdmin();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-brand-green text-white z-40 shadow-2xl flex flex-col border-r border-white/10">
      {/* Brand Header */}
      <div className="p-8 pb-4">
        <h1 className="font-head text-2xl font-black tracking-tight leading-none">
          The <span className="text-brand-warm italic">Anjaraipetti</span>
        </h1>
        <p className="text-white/40 text-[10px] font-black tracking-widest uppercase mt-2 pl-1">Admin Panel</p>
        <div className="h-px w-full bg-white/10 mt-6" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-white/30 text-[9px] font-black uppercase tracking-[3px] mb-4 pl-4">{group.group}</h3>
            <div className="space-y-1.5 px-1">
              {group.items.map(item => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13.5px] font-bold transition-all duration-300 group
                    ${isActive 
                      ? 'bg-white/20 text-white shadow-inner translate-x-1' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer */}
      <div className="p-6 bg-brand-dark/20 backdrop-blur-md border-t border-white/5 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 border border-white/10 rounded-2xl bg-white/5">
          <div className="w-8 h-8 rounded-xl bg-brand-warm flex items-center justify-center font-bold text-xs uppercase">
            {admin?.username?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-black text-white/40 uppercase tracking-widest leading-none">Admin</p>
            <p className="text-xs font-bold text-white truncate mt-1">{admin?.username || 'admin'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a 
            href="/" target="_blank"
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl text-white/80 transition-all group"
            title="View Live Store"
          >
            <ExternalLink size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-bold uppercase">Store</span>
          </a>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-brand-sale/10 hover:bg-brand-sale/30 p-2.5 rounded-xl text-brand-sale transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
            <span className="text-[10px] font-bold uppercase">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
