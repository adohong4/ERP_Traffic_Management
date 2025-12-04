import { motion } from 'motion/react';
import { Shield, MapPin, Building2 } from 'lucide-react';
import { usePermissions, getLocationDisplayName, getRoleDisplayName } from '../context/PermissionsContext';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function PermissionBadge() {
  const { permissions, userConfig } = usePermissions();

  if (!userConfig) {
    return null;
  }

  const locationName = getLocationDisplayName(permissions.locationScope);
  const roleName = getRoleDisplayName(permissions.role);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        {/* Role Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/40 text-cyan-700 flex items-center gap-1.5 px-3 py-1"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{roleName}</span>
              </Badge>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Vai trò: {roleName}</p>
          </TooltipContent>
        </Tooltip>

        {/* Location Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-teal-500/10 to-green-500/10 border-teal-400/40 text-teal-700 flex items-center gap-1.5 px-3 py-1"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{locationName}</span>
              </Badge>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Phạm vi: {locationName}</p>
          </TooltipContent>
        </Tooltip>

        {/* Organization Badge */}
        {userConfig.organization && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-400/40 text-blue-700 flex items-center gap-1.5 px-3 py-1 max-w-[200px]"
                >
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs font-medium truncate">{userConfig.organization}</span>
                </Badge>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{userConfig.organization}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
