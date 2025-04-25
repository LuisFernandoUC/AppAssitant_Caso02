CREATE PROCEDURE sp_CreatePayment
    @userId VARCHAR(50),
    @amount DECIMAL(10,2),
    @date DATETIME,
    @servicio VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Payments (userId, amount, date, servicio)
    VALUES (@userId, @amount, @date, @servicio);

    SELECT SCOPE_IDENTITY() AS id;
END;
