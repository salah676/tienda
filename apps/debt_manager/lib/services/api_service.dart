import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://superadmin-2n3zh5yjl-msalah-s-projects5.vercel.app/api';
  String? _token;
  String? _userRole;
  String? _tenantId;

  Future<void> setToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> setUserInfo(String role, String tenantId) async {
    _userRole = role;
    _tenantId = tenantId;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_role', role);
    await prefs.setString('tenant_id', tenantId);
  }

  Future<String?> getToken() async {
    if (_token != null) return _token;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    _userRole = prefs.getString('user_role');
    _tenantId = prefs.getString('tenant_id');
    return _token;
  }

  Future<String?> getUserRole() async {
    if (_userRole != null) return _userRole;
    final prefs = await SharedPreferences.getInstance();
    _userRole = prefs.getString('user_role');
    return _userRole;
  }

  Future<String?> getTenantId() async {
    if (_tenantId != null) return _tenantId;
    final prefs = await SharedPreferences.getInstance();
    _tenantId = prefs.getString('tenant_id');
    return _tenantId;
  }

  Future<void> logout() async {
    _token = null;
    _userRole = null;
    _tenantId = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    await prefs.remove('user_role');
    await prefs.remove('tenant_id');
    await prefs.remove('user_data');
  }

  Future<Map<String, dynamic>> superadminLogin(String email, String password) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200 && data['success'] == true) {
      await setToken(data['token']);
      await setUserInfo('superadmin', '');
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_data', jsonEncode(data['user']));
    }
    return data;
  }

  Future<Map<String, dynamic>> tenantLogin(String email, String password, String tenantId) async {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/tenant-login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password, 'tenantId': tenantId}),
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200 && data['success'] == true) {
      await setToken(data['token']);
      await setUserInfo(data['user']['role'], tenantId);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_data', jsonEncode(data['user']));
    }
    return data;
  }

  Future<List<dynamic>> getStats() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/superadmin/stats'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? [data['data']] : [];
  }

  Future<List<dynamic>> getTenants() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/superadmin/tenants'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<List<dynamic>> getPlans() async {
    final res = await http.get(Uri.parse('$baseUrl/superadmin/plans'));
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<List<dynamic>> getClients() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/clients'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<List<dynamic>> getDebts() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/debts'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<List<dynamic>> getPayments() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/payments'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<List<dynamic>> getProducts() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/products'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<bool> createTenant(Map<String, dynamic> data) async {
    final token = await getToken();
    if (token == null) return false;
    final res = await http.post(
      Uri.parse('$baseUrl/superadmin/tenants'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return res.statusCode == 200;
  }

  Future<bool> createClient(Map<String, dynamic> data) async {
    final token = await getToken();
    if (token == null) return false;
    final res = await http.post(
      Uri.parse('$baseUrl/clients'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return res.statusCode == 200;
  }

  Future<bool> createDebt(Map<String, dynamic> data) async {
    final token = await getToken();
    if (token == null) return false;
    final res = await http.post(
      Uri.parse('$baseUrl/debts'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return res.statusCode == 200;
  }

  Future<bool> createPayment(Map<String, dynamic> data) async {
    final token = await getToken();
    if (token == null) return false;
    final res = await http.post(
      Uri.parse('$baseUrl/payments'),
      headers: {'Authorization': 'Bearer $token', 'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return res.statusCode == 200;
  }

  Future<List<dynamic>> getClientDebts() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/client/debts'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }

  Future<List<dynamic>> getClientPayments() async {
    final token = await getToken();
    if (token == null) return [];
    final res = await http.get(
      Uri.parse('$baseUrl/client/payments'),
      headers: {'Authorization': 'Bearer $token'},
    );
    final data = jsonDecode(res.body);
    return data['success'] == true ? data['data'] : [];
  }
}

final apiService = ApiService();