cost = 5.28e14
account1 = cost
account2 = account1 - cost

dps1 = 1.19e9
dps2 = 1.215e9

time = 0
while True:
    account1 += dps1
    account2 += dps2
    if account2 > account1:
        print(account1, account2, time)
        break
    time += 1
