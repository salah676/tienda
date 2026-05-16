import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../login_screen.dart';
import 'dashboard_screen.dart';
import 'clients_screen.dart';
import 'debts_screen.dart';
import 'payments_screen.dart';

class AdminHomeScreen extends StatefulWidget {
  final bool isSuperAdmin;

  const AdminHomeScreen({super.key, required this.isSuperAdmin});

  @override
  State<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends State<AdminHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = widget.isSuperAdmin
        ? [
            const DashboardScreen(isSuperAdmin: true),
            const TenantsScreen(),
            const PlansScreen(),
          ]
        : [
            const DashboardScreen(isSuperAdmin: false),
            const ClientsScreen(),
            const DebtsScreen(),
            const PaymentsScreen(),
          ];

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.isSuperAdmin ? 'SuperAdmin' : 'Admin'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await apiService.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          ),
        ],
      ),
      body: screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        items: widget.isSuperAdmin
            ? const [
                BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
                BottomNavigationBarItem(icon: Icon(Icons.store), label: 'Tiendas'),
                BottomNavigationBarItem(icon: Icon(Icons.card_membership), label: 'Planes'),
              ]
            : const [
                BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
                BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Clientes'),
                BottomNavigationBarItem(icon: Icon(Icons.receipt), label: 'Deudas'),
                BottomNavigationBarItem(icon: Icon(Icons.payment), label: 'Pagos'),
              ],
      ),
    );
  }
}

class TenantsScreen extends StatefulWidget {
  const TenantsScreen({super.key});

  @override
  State<TenantsScreen> createState() => _TenantsScreenState();
}

class _TenantsScreenState extends State<TenantsScreen> {
  List<dynamic> _tenants = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadTenants();
  }

  Future<void> _loadTenants() async {
    final data = await apiService.getTenants();
    setState(() {
      _tenants = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadTenants,
      child: _tenants.isEmpty
          ? const Center(child: Text('No hay tiendas'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _tenants.length,
              itemBuilder: (context, index) {
                final tenant = _tenants[index];
                return Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: tenant['isActive'] ? Colors.green : Colors.red,
                      child: const Icon(Icons.store, color: Colors.white),
                    ),
                    title: Text(tenant['name'] ?? ''),
                    subtitle: Text(tenant['email'] ?? ''),
                    trailing: Chip(
                      label: Text(tenant['isActive'] ? 'Activo' : 'Inactivo'),
                      backgroundColor: tenant['isActive'] ? Colors.green[100] : Colors.red[100],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

class PlansScreen extends StatefulWidget {
  const PlansScreen({super.key});

  @override
  State<PlansScreen> createState() => _PlansScreenState();
}

class _PlansScreenState extends State<PlansScreen> {
  List<dynamic> _plans = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPlans();
  }

  Future<void> _loadPlans() async {
    final data = await apiService.getPlans();
    setState(() {
      _plans = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadPlans,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _plans.length,
        itemBuilder: (context, index) {
          final plan = _plans[index];
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(plan['name'] ?? '', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('\$${plan['price']} / año', style: const TextStyle(fontSize: 24, color: Colors.blue)),
                  const SizedBox(height: 8),
                  Text(plan['features'] ?? ''),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}