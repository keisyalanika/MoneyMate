import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class UserAvatar extends StatelessWidget {
  final double size;
  final String avatarUrl;
  final String initial;
  final Color backgroundColor;
  final bool showShadow;

  const UserAvatar({
    super.key,
    required this.size,
    required this.avatarUrl,
    required this.initial,
    this.backgroundColor = AppColors.primaryBrown,
    this.showShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    final url = ApiService.resolveMediaUrl(avatarUrl);

    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: backgroundColor,
        shape: BoxShape.circle,
        boxShadow: showShadow
            ? [
                BoxShadow(
                  color: backgroundColor.withValues(alpha: 0.2),
                  blurRadius: size * 0.15,
                  offset: const Offset(0, 4),
                ),
              ]
            : null,
      ),
      clipBehavior: Clip.antiAlias,
      child: url.isEmpty
          ? _buildInitial()
          : Image.network(
              url,
              width: size,
              height: size,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => _buildInitial(),
            ),
    );
  }

  Widget _buildInitial() {
    return Center(
      child: Text(
        initial.isEmpty ? 'U' : initial,
        style: TextStyle(
          fontSize: size * 0.4,
          color: Colors.white,
          fontFamily: 'serif',
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
