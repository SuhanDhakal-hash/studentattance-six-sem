import 'package:flutter/material.dart';
import 'pages/auth/login_page.dart';

void main() {
  runApp(const StudentAttendanceApp());
}

class StudentAttendanceApp extends StatelessWidget {
  const StudentAttendanceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Student Attendance System',

      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2563EB),
        ),
        fontFamily: 'Arial',
        scaffoldBackgroundColor: const Color(0xFFF1F5F9),
      ),

      home: const LoginPage(),
    );
  }
}