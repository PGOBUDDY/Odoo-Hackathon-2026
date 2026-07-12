import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/api_client.dart';
import 'core/constants.dart';
import 'providers/auth_provider.dart';
import 'providers/dashboard_provider.dart';
import 'screens/auth/login_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';

void main() {
  runApp(const TransitOpsApp());
}

class TransitOpsApp extends StatelessWidget {
  const TransitOpsApp({super.key});

  @override
  Widget build(BuildContext context) {
    final apiClient = ApiClient(); // shared across all providers/services

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(apiClient)),
        ChangeNotifierProvider(create: (_) => DashboardProvider(apiClient)),
      ],
      child: MaterialApp(
        title: 'TransitOps',
        theme: ThemeData(
          colorSchemeSeed: Colors.indigo,
          useMaterial3: true,
        ),
        initialRoute: AppRoutes.login,
        routes: {
          AppRoutes.login: (_) => const LoginScreen(),
          AppRoutes.dashboard: (_) => const DashboardScreen(),
        },
      ),
    );
  }
}
