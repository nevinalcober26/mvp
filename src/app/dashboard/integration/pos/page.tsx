'use client';

import React, { useState } from 'react';
import { DashboardHeader } from "@/components/dashboard/header";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  PlugZap, 
  Plus, 
  RefreshCw, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Monitor,
  ArrowRight,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type PosStatus = 'active' | 'error' | 'syncing' | 'disconnected';

interface PosConnection {
  id: string;
  brand: string;
  label: string;
  status: PosStatus;
  lastSync: string;
  terminalId: string;
}

const SUPPORTED_POS = [
  { id: 'toast', name: 'Toast', description: 'Enterprise restaurant platform' },
  { id: 'square', name: 'Square', description: 'Universal payment & POS solution' },
  { id: 'revel', name: 'Revel Systems', description: 'iPad-based POS for high volume' },
  { id: 'clover', name: 'Clover', description: 'Integrated merchant services' },
];

export default function PosIntegrationPage() {
  const { toast } = useToast();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connections, setConnections] = useState<PosConnection[]>([
    { 
      id: '1', 
      brand: 'Toast', 
      label: 'Main Dining Room', 
      status: 'active', 
      lastSync: '2 minutes ago',
      terminalId: 'TOAST-RAK-01'
    },
    { 
      id: '2', 
      brand: 'Square', 
      label: 'Express Bar', 
      status: 'error', 
      lastSync: '1 hour ago',
      terminalId: 'SQ-BAR-99'
    },
  ]);

  const handleSyncAll = () => {
    toast({
      title: "Global Sync Initiated",
      description: "Refreshing data from all connected POS systems.",
    });
  };

  const handleRemoveConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Connection Removed",
      description: "The POS system has been successfully disconnected.",
    });
  };

  const getStatusBadge = (status: PosStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none gap-1.5"><CheckCircle2 className="h-3 w-3" /> Live</Badge>;
      case 'error':
        return <Badge variant="destructive" className="gap-1.5"><AlertCircle className="h-3 w-3" /> Connection Error</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none gap-1.5"><RefreshCw className="h-3 w-3 animate-spin" /> Syncing</Badge>;
      default:
        return <Badge variant="secondary">Offline</Badge>;
    }
  };

  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-6 lg:p-8 bg-muted/30 min-h-[calc(100vh-4rem)]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">POS Integration</h1>
              <p className="text-muted-foreground mt-1">Manage multiple terminal connections and real-time menu synchronization.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 font-semibold" onClick={handleSyncAll}>
                <RefreshCw className="h-4 w-4" />
                Sync All
              </Button>
              <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 font-bold bg-primary hover:bg-primary/90">
                    <Plus className="h-5 w-5" />
                    Connect New POS
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
                  <div className="bg-primary p-8 text-primary-foreground">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white">Add POS Connection</DialogTitle>
                      <DialogDescription className="text-primary-foreground/80">
                        Connect a specific system or machine to your digital hub.
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Provider</Label>
                        <Select>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Choose POS brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {SUPPORTED_POS.map(pos => (
                              <SelectItem key={pos.id} value={pos.id}>
                                <div className="flex flex-col py-1">
                                  <span className="font-bold">{pos.name}</span>
                                  <span className="text-[10px] text-muted-foreground uppercase">{pos.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Internal Label</Label>
                          <Input placeholder="e.g. Bar Terminal" className="h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Machine / Zone ID</Label>
                          <Input placeholder="e.g. BAR-01" className="h-11" />
                        </div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">API Configuration</Label>
                        <Input placeholder="Access Token or API Key" type="password" className="h-11" />
                        <p className="text-[10px] text-muted-foreground italic">Consult your POS provider dashboard for your secure credentials.</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="p-6 bg-muted/20 border-t flex flex-row items-center justify-between">
                    <Button variant="ghost" onClick={() => setIsConnectModalOpen(false)}>Cancel</Button>
                    <Button className="font-bold bg-primary text-primary-foreground px-8" onClick={() => {
                      setIsConnectModalOpen(false);
                      toast({ title: "Connection Successful", description: "The new POS has been linked to your branch." });
                    }}>
                      Verify & Connect
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Integration Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map((conn) => (
              <Card key={conn.id} className={cn(
                "overflow-hidden border-2 transition-all hover:shadow-md",
                conn.status === 'error' ? "border-destructive/20" : "border-border"
              )}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{conn.label}</CardTitle>
                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{conn.brand} System</p>
                      </div>
                    </div>
                    {getStatusBadge(conn.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50 border space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Last Sync</p>
                      <p className="text-xs font-bold">{conn.lastSync}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Terminal ID</p>
                      <p className="text-xs font-bold font-mono">{conn.terminalId}</p>
                    </div>
                  </div>
                  
                  {conn.status === 'error' && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-destructive">Authentication Failed</p>
                        <p className="text-[10px] leading-tight text-destructive/80">Your API key for this terminal has expired or was revoked. Please update configuration.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-muted/30 border-t p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveConnection(conn.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider px-3 gap-2">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Manual Sync
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Empty State / Add Card */}
            <button 
              onClick={() => setIsConnectModalOpen(true)}
              className="h-full min-h-[240px] rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-4 hover:bg-muted/20 hover:border-primary/30 transition-all group"
            >
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="font-bold text-sm">Add System</p>
                <p className="text-xs text-muted-foreground">Connect another POS machine</p>
              </div>
            </button>
          </div>

          {/* Help & Documentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Understanding Synchronization
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Menu & Categories", desc: "Digital hub pulls all items, prices, and hierarchy from POS." },
                  { title: "Inventory Levels", desc: "Real-time stock tracking prevents out-of-stock orders." },
                  { title: "Order Injection", desc: "Customer QR orders are sent directly to the POS kitchen display." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</div>
                    <div>
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-blue-50/50 border-blue-100 shadow-none">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full space-y-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold">Need assistance with your POS?</p>
                  <p className="text-sm text-muted-foreground">Our technical team can help you map your complex menu structures or troubleshoot connectivity issues.</p>
                </div>
                <Button variant="link" className="text-blue-600 font-bold gap-2">
                  View Integration Guides
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
