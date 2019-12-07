from sklearn.cluster import KMeans
import numpy as np
from joblib import dump
import matplotlib.pyplot as plt


X = np.genfromtxt('lib/data/Data.csv', delimiter=',', skip_header=1)

startpts=np.array([
    [6.1, 22, 23.332],
    [22.1, 35, 27.325],
    [24.2, 40, 29.016],
    [32.6, 50, 31.79]], np.float64)

model = KMeans(n_clusters=4, init=startpts, n_init=1).fit(X)

Y = model.predict(X)

colors = ['b', 'c', 'y', 'm', 'r']
unique = np.unique(Y)

fat = X[:, 0]
age = X[:, 1]
bmi = X[:, 2]
for i, u in enumerate(unique):
    xi = [fat[j] for j  in range(len(fat)) if Y[j] == u]
    yi = [age[j] for j  in range(len(age)) if Y[j] == u]
    plt.scatter(xi, yi, c=colors[i], label="Workout {}".format(u))

plt.xlabel('fat')
plt.ylabel('age')
plt.legend()
centers = model.cluster_centers_
plt.scatter(centers[:, 0], centers[:, 1], c='black', s=200, alpha=0.5)
plt.show()

for i, u in enumerate(unique):
    xi = [bmi[j] for j  in range(len(fat)) if Y[j] == u]
    yi = [age[j] for j  in range(len(age)) if Y[j] == u]
    plt.scatter(xi, yi, c=colors[i], label="Workout {}".format(u))

plt.xlabel('bmi')
plt.ylabel('age')
plt.legend()
centers = model.cluster_centers_
plt.scatter(centers[:, 2], centers[:, 1], c='black', s=200, alpha=0.5)
plt.show()

dump(model, 'lib/models/model.joblib')

print('Model training completed')