import 'package:flutter/material.dart';
import 'auth/login_page.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Student Attendance System',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const LoginPage(),
                ),
              );
            },
            child: const Text('Login'),
          ),
          const SizedBox(width: 15),
        ],
      ),

      body: SingleChildScrollView(
        child: Column(
          children: [
            // HERO SECTION
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: 60,
                vertical: 100,
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.school,
                    size: 100,
                  ),

                  const SizedBox(height: 30),

                  const Text(
                    'Student Attendance\nManagement System',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 20),

                  const Text(
                    'A modern web-based system for managing students, '
                    'faculty, classes and attendance efficiently.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),

                  const SizedBox(height: 35),

                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LoginPage(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 35,
                        vertical: 18,
                      ),
                    ),
                    child: const Text(
                      'Get Started',
                      style: TextStyle(fontSize: 17),
                    ),
                  ),
                ],
              ),
            ),

            // FEATURES
            const Padding(
              padding: EdgeInsets.all(30),
              child: Text(
                'Features',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 50,
                vertical: 20,
              ),
              child: Wrap(
                spacing: 25,
                runSpacing: 25,
                alignment: WrapAlignment.center,
                children: const [
                  FeatureCard(
                    icon: Icons.people,
                    title: 'Student Management',
                    description:
                        'Manage student information easily.',
                  ),
                  FeatureCard(
                    icon: Icons.fact_check,
                    title: 'Attendance Tracking',
                    description:
                        'Record and monitor student attendance.',
                  ),
                  FeatureCard(
                    icon: Icons.school,
                    title: 'Faculty Management',
                    description:
                        'Manage faculty and teaching staff.',
                  ),
                  FeatureCard(
                    icon: Icons.bar_chart,
                    title: 'Attendance Reports',
                    description:
                        'Generate useful attendance reports.',
                  ),
                ],
              ),
            ),

            const SizedBox(height: 60),

            // FOOTER
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(25),
              child: const Center(
                child: Text(
                  '© 2026 Student Attendance Management System',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const FeatureCard({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 250,
      height: 200,
      child: Card(
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 50,
              ),
              const SizedBox(height: 15),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                description,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}