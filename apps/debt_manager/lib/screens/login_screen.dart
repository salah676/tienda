import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import 'admin/admin_home_screen.dart';
import 'client/client_home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _tenantIdController = TextEditingController();
  bool _isSuperAdmin = true;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    if (token != null) {
      _navigateToHome();
    }
  }

  void _navigateToHome() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
    );
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      Map<String, dynamic> result;
      if (_isSuperAdmin) {
        result = await apiService.superadminLogin(
          _emailController.text,
          _passwordController.text,
        );
      } else {
        result = await apiService.tenantLogin(
          _emailController.text,
          _passwordController.text,
          _tenantIdController.text,
        );
      }

      if (result['success'] == true) {
        _navigateToHome();
      } else {
        setState(() {
          _error = result['error'] ?? 'Login fallido';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error de conexion';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(Icons.account_balance_wallet, size: 80, color: Colors.blue),
                  const SizedBox(height: 16),
                  const Text(
                    'Debt Manager',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _isSuperAdmin ? 'SuperAdmin' : 'Tienda Admin',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 32),
                  ToggleButtons(
                    isSelected: [_isSuperAdmin, !_isSuperAdmin],
                    onPressed: (index) {
                      setState(() {
                        _isSuperAdmin = index == 0;
                      });
                    },
                    borderRadius: BorderRadius.circular(8),
                    children: const [
                      Padding(padding: EdgeInsets.symmetric(horizontal: 16), child: Text('SuperAdmin')),
                      Padding(padding: EdgeInsets.symmetric(horizontal: 16), child: Text('Admin Tienda')),
                    ],
                  ),
                  const SizedBox(height: 24),
                  if (!_isSuperAdmin) ...[
                    TextFormField(
                      controller: _tenantIdController,
                      decoration: const InputDecoration(
                        labelText: 'ID Tienda',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.store),
                      ),
                      validator: (value) {
                        if (!_isSuperAdmin && (value == null || value.isEmpty)) {
                          return 'Ingrese ID de tienda';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                  ],
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.email),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Ingrese email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(),
                      prefixIcon: Icon(Icons.lock),
                    ),
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Ingrese password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  if (_error != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red[50],
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.red),
                      ),
                      child: Text(_error!, style: TextStyle(color: Colors.red[700])),
                    ),
                  ElevatedButton(
                    onPressed: _loading ? null : _login,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    child: _loading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Iniciar Sesion', style: TextStyle(fontSize: 16)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: apiService.getUserRole(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        final role = snapshot.data;
        if (role == 'superadmin') {
          return const AdminHomeScreen(isSuperAdmin: true);
        } else if (role == 'client') {
          return const ClientHomeScreen();
        }
        return const AdminHomeScreen(isSuperAdmin: false);
      },
    );
  }
}