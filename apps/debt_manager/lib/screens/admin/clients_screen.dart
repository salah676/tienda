import 'package:flutter/material.dart';
import '../../services/api_service.dart';

class ClientsScreen extends StatefulWidget {
  const ClientsScreen({super.key});

  @override
  State<ClientsScreen> createState() => _ClientsScreenState();
}

class _ClientsScreenState extends State<ClientsScreen> {
  List<dynamic> _clients = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadClients();
  }

  Future<void> _loadClients() async {
    final data = await apiService.getClients();
    setState(() {
      _clients = data;
      _loading = false;
    });
  }

  void _showAddDialog() {
    final nameController = TextEditingController();
    final phoneController = TextEditingController();
    final emailController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Nuevo Cliente'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Nombre')),
            const SizedBox(height: 12),
            TextField(controller: phoneController, decoration: const InputDecoration(labelText: 'Telefono')),
            const SizedBox(height: 12),
            TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Email (opcional)')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () async {
              if (nameController.text.isEmpty || phoneController.text.isEmpty) return;
              final success = await apiService.createClient({
                'name': nameController.text,
                'phone': phoneController.text,
                'email': emailController.text.isEmpty ? null : emailController.text,
              });
              if (success && context.mounted) {
                Navigator.pop(context);
                _loadClients();
              }
            },
            child: const Text('Crear'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadClients,
              child: _clients.isEmpty
                  ? const Center(child: Text('No hay clientes'))
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: _clients.length,
                      itemBuilder: (context, index) {
                        final client = _clients[index];
                        return Card(
                          child: ListTile(
                            leading: CircleAvatar(child: Text(client['name']?[0] ?? '?')),
                            title: Text(client['name'] ?? ''),
                            subtitle: Text(client['phone'] ?? ''),
                            trailing: const Icon(Icons.chevron_right),
                          ),
                        );
                      },
                    ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
}