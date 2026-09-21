import 'package:flutter_test/flutter_test.dart';
import 'package:moneymate_mobile/main.dart';

void main() {
  testWidgets('MoneyMate smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MoneyMateApp());
    expect(find.text('MoneyMate'), findsOneWidget);
  });
}
