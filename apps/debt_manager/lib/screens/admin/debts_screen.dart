import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class DebtsScreen extends StatefulWidget {
  const DebtsScreen({super.key});

  @override
  State<DebtsScreen> createState() => _DebtsScreenState();
}

class _DebtsScreenState extends State<DebtsScreen> {
  List<dynamic> _debts = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDebts();
  }

  Future<void> _loadDebts() async {
    final data = await apiService.getDebts();
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

    return RefreshIndicator(
      onRefresh: _loadDebts,
      child: _debts.isEmpty
          ? const Center(child: Text('No hay deudas'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _debts.length,
              itemBuilder: (context, index) {
                final debt = _debts[index];
                final remaining = (debt['totalAmount'] ?? 0) - (debt['paidAmount'] ?? 0);
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(debt['client']?['name'] ?? 'Cliente', style: const TextStyle(fontWeight: FontWeight.bold)),
                            _buildStatusChip(debt['status']),
                          ],
                        ),
                        const SizedBox(height: 12),
                        LinearProgressIndicator(
                          value: ((debt['paidAmount'] ?? 0) / (debt['totalAmount'] ?? 1)).clamp(0.0, 1.0),
                          backgroundColor: Colors.grey[300],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Total: \$${debt['totalAmount']}'),
                            Text('Pagado: \$${debt['paidAmount']}'),
                            Text('Restante: \$${remaining.toStringAsFixed(2)}'),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  Widget _buildStatusChip(String? status) {
    Color color;
    switch (status) {
      case 'paid':
        color = Colors.green;
        break;
      case 'partial':
        color = Colors.orange;
        break;
      default:
        color = Colors.red;
    }
    return Chip(
      label: Text(status ?? 'pending', style: const TextStyle(color: Colors.white, fontSize: 12)),
      backgroundColor: color,
    );
  }
}