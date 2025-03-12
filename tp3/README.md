# CG 2024/2025

## Group T4G08

## TP 3 Notes


## Screenshots for the class

### Exercice 1

#### Unit Cube with Wooden Material

First we defined a normal for every vertex of the cube. After this we could create a new material with its color being similar to wood (hex #A1662F).
Defining these allows us to turn on the light and see the new color of the cube as seen in the screenshot:

![Screenshot 8](screenshots/cg-t04g08-tp3-1.png)

#### Tangram

To make the tangram work we first had to define the normals for every atom piece of the tangram. This means we had to define normals of the Triangles, Parallelogram and Diamond.
After this was done we could start to define the colors of each piece. This was done using materials and applying each material to the corresponding piece.
For example:

The head of the horse (as in the original image) has a pinkish color. So, to create this color we first created a material where we defined the rgb components as follows:

```js
this.headMaterial = new CGFappearance(scene);
this.headMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
this.headMaterial.setSpecular(241 / 255, 161 / 255, 208 / 255, 0);
this.headMaterial.setDiffuse(0, 0, 0, 1.0);
this.headMaterial.setShininess(10.0);
```

and after we applied it to the corresponding triangle:

```js
this.head.display();
```

Because most of the materials only have the specular light enabled (ambient and diffuse are set to 0) we had to create more lights and change the attenuation of the lights to allow us to take a clear picture of the tangram with the right colors.

## Notes:

### Difuse Light

We observed that when the light is behind the polygon we cound't see the polygon.
However, after moving the light we started to see the color of the polygon appearing.

Moving the light to (x:2, y:2, z:1) we see that the polygon gets illuminated from the top right corner.
We also see that moving the camera does not affect the way light appears on screen. This is shown in the images down below:

![Screenshot 1](screenshots/extras/difuseAngle1.png)

![Screenshot 2](screenshots/extras/difuseAngle2.png)

This means that this type of light is not affected by the position of the observer.

### Specular Light

Specular light acts different when comparing against the difuse light. This is because specular light is affected by the
position of the observer.

This can be clearly seen in the images down below:

![Screenshot 3](screenshots/extras/specularAngle1.png)

![Screenshot 4](screenshots/extras/specularAngle2.png)

Changing the shininess we see that the object gets progressively darker as the shininess is higher.
This is expected as a shinier object means less spread of light thus it getting progressivelly darker and the beam of light more focused.

![Screenshot 5](screenshots/extras/specularAngle1-Intencity01.png)

![Screenshot 6](screenshots/extras/specularAngle1-Intencity02.png)

![Screenshot 7](screenshots/extras/specularAngle1-Intencity03.png)

### Combination of lighting components




