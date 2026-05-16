import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class DashboardScreen extends StatefulWidget {
  final bool isSuperAdmin;

  const DashboardScreen({super.key, required this.isSuperAdmin});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadStats();
  }

  Future<void> _loadStats() async {
    final data = await apiService.getStats();
    setState(() {
      if (data.isNotEmpty) _stats = data.first;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    return RefreshIndicator(
      onRefresh: _loadStats,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (widget.isSuperAdmin) ...[
              _buildStatCard('Tiendas Totales', '${_stats?['total_tenants'] ?? 0}', Icons.store, Colors.blue),
              _buildStatCard('Tiendas Activas', '${_stats?['active_tenants'] ?? 0}', Icons.check_circle, Colors.green),
              _buildStatCard('Clientes Totales', '${_stats?['total_clients'] ?? 0}', Icons.people, Colors.orange),
              _buildStatCard('Deudas Totales', '${_stats?['total_debts'] ?? 0}', Icons.receipt, Colors.purple),
              _buildStatCard('Monto Total', '\$${(_stats?['total_amount'] ?? 0).toStringAsFixed(2)}', Icons.attach_money, Colors.red),
              _buildStatCard('Cobrado', '\$${(_stats?['total_collected'] ?? 0).toStringAsFixed(2)}', Icons.payments, Colors.teal),
            ] else ...[
              _buildStatCard('Clientes', '${_stats?['total_clients'] ?? 0}', Icons.people, Colors.blue),
              _buildStatCard('Deudas Activas', '${_stats?['active_debts'] ?? 0}', Icons.receipt, Colors.orange),
              _buildStatCard('Monto Total', '\$${(_stats?['total_amount'] ?? 0).toStringAsFixed(2)}', Icons.attach_money, Colors.red),
              _buildStatCard('Cobrado', '\$${(_stats?['total_collected'] ?? 0).toStringAsFixed(2)}', Icons.payments, Colors.green),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
                  const SizedBox(height: 4),
                  Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}