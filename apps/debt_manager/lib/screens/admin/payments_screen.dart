import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  List<dynamic> _payments = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPayments();
  }

  Future<void> _loadPayments() async {
    final data = await apiService.getPayments();
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
                    leading: CircleAvatar(
                      backgroundColor: Colors.green,
                      child: const Icon(Icons.payment, color: Colors.white),
                    ),
                    title: Text('\$${payment['amount']}'),
                    subtitle: Text('${payment['method']} - ${payment['debt']?['client']?['name'] ?? ''}'),
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