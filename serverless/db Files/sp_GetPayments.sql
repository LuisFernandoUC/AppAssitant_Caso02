ALTER PROCEDURE sp_GetPayments
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        userId,
        amount,
        date,
        servicio,
        createdAt
    FROM Payments;
END;
