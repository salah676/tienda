import 'package:flutter/material.dart';
import '../../services/api_service.dart';
import '../login_screen.dart';

class ClientHomeScreen extends StatefulWidget {
  const ClientHomeScreen({super.key});

  @override
  State<ClientHomeScreen> createState() => _ClientHomeScreenState();
}

class _ClientHomeScreenState extends State<ClientHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      const ClientHomeContent(),
      const ClientHistoryContent(),
      const ClientProfileContent(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Cuenta'),
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
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Inicio'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Historial'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Perfil'),
        ],
      ),
    );
  }
}

class ClientHomeContent extends StatefulWidget {
  const ClientHomeContent({super.key});

  @override
  State<ClientHomeContent> createState() => _ClientHomeContentState();
}

class _ClientHomeContentState extends State<ClientHomeContent> {
  List<dynamic> _debts = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDebts();
  }

  Future<void> _loadDebts() async {
    final data = await apiService.getClientDebts();
    setState(() {
      _debts = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    final totalDebt = _debts.fold<double>(0, (sum, d) => sum + ((d['totalAmount'] ?? 0) - (d['paidAmount'] ?? 0)));
    final activeDebts = _debts.where((d) => d['status'] != 'paid').length;

    return RefreshIndicator(
      onRefresh: _loadDebts,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              color: Colors.blue,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Icon(Icons.account_balance_wallet, color: Colors.white, size: 48),
                    const SizedBox(height: 12),
                    const Text('Mi Deuda Total', style: TextStyle(color: Colors.white70)),
                    const SizedBox(height: 8),
                    Text(
                      '\$${totalDebt.toStringAsFixed(2)}',
                      style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Text('$activeDebts deudas activas', style: const TextStyle(color: Colors.white70)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text('Mis Deudas', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            if (_debts.isEmpty)
              const Center(child: Text('No tienes deudas'))
            else
              ..._debts.map((debt) => Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Deuda', style: TextStyle(fontWeight: FontWeight.bold)),
                              Chip(
                                label: Text(debt['status'] ?? 'pending'),
                                backgroundColor: _getStatusColor(debt['status']),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          LinearProgressIndicator(
                            value: ((debt['paidAmount'] ?? 0) / (debt['totalAmount'] ?? 1)).clamp(0.0, 1.0),
                            backgroundColor: Colors.grey[300],
                          ),
                          const SizedBox(height: 8),
                          Text('Total: \$${debt['totalAmount']} | Pagado: \$${debt['paidAmount']}'),
                          Text(
                            'Restante: \$${((debt['totalAmount'] ?? 0) - (debt['paidAmount'] ?? 0)).toStringAsFixed(2)}',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  )),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'paid':
        return Colors.green;
      case 'partial':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }
}

class ClientHistoryContent extends StatefulWidget {
  const ClientHistoryContent({super.key});

  @override
  State<ClientHistoryContent> createState() => _ClientHistoryContentState();
}

class _ClientHistoryContentState extends State<ClientHistoryContent> {
  List<dynamic> _payments = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPayments();
  }

  Future<void> _loadPayments() async {
    final data = await apiService.getClientPayments();
    setState(() {
      _payments = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadPayments,
      child: _payments.isEmpty
          ? const Center(child: Text('No hay pagos'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _payments.length,
              itemBuilder: (context, index) {
                final payment = _payments[index];
                return Card(
                  child: ListTile(
                    leading: const CircleAvatar(
                      backgroundColor: Colors.green,
                      child: Icon(Icons.check, color: Colors.white),
                    ),
                    title: Text('\$${payment['amount']}'),
                    subtitle: Text(payment['method'] ?? ''),
                    trailing: Text(_formatDate(payment['createdAt'])),
                  ),
                );
              },
            ),
    );
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '';
    final date = DateTime.tryParse(dateStr);
    if (date == null) return dateStr;
    return '${date.day}/${date.month}/${date.year}';
  }
}

class ClientProfileContent extends StatelessWidget {
  const ClientProfileContent({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(radius: 50, child: Icon(Icons.person, size: 50)),
          SizedBox(height: 16),
          Text('Mi Perfil', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          SizedBox(height: 8),
          Text('Informacion del cliente'),
        ],
      ),
    );
  }
}